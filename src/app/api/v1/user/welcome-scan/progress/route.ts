/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/auth";
import { NextRequest, NextResponse } from "next/server";

import { logger } from "../../../../../functions/server/logging";

import AppConstants from "../../../../../../appConstants";
import {
  getOnerepProfileId,
  getSubscriberByEmail,
} from "../../../../../../db/tables/subscribers";

import {
  getLatestOnerepScanResults,
  addOnerepScanResults,
} from "../../../../../../db/tables/onerep_scans";
import {
  ListScanResultsResponse,
  Scan,
  getScanDetails,
  getAllScanResults,
  optoutProfile,
} from "../../../../../functions/server/onerep";
import { hasPremium } from "../../../../../functions/universal/user";

export interface ScanProgressBody {
  success: boolean;
  scan?: Scan;
  results?: ListScanResultsResponse;
}

// Periodically checking the scan progress and set the result if finished.
// A webhook is used as well, but this ensures that we get the latest data.
// @see the onerep-events route and https://docs.onerep.com/#section/Webhooks-Endpoints
export async function GET(
  _req: NextRequest,
): Promise<NextResponse<ScanProgressBody> | NextResponse<unknown>> {
  const session = await getServerSession(authOptions);
  if (typeof session?.user?.email === "string") {
    try {
      const subscriber = await getSubscriberByEmail(session.user.email);
      const profileId = (await getOnerepProfileId(subscriber.id))[0][
        "onerep_profile_id"
      ] as number;

      const latestScan = await getLatestOnerepScanResults(profileId);
      const latestScanId = latestScan.scan?.onerep_scan_id;

      if (typeof latestScanId === "undefined" && hasPremium(session.user)) {
        // If the user already has Plus, we did not start a manual scan right
        // away, and the automatic initial scan might not have kicked off yet:
        return NextResponse.json(
          { success: true, status: "in_progress" as Scan["status"] },
          { status: 200 },
        );
      }
      if (typeof latestScanId !== "undefined") {
        const scan = await getScanDetails(profileId, latestScanId);

        // Store scan results.
        if (scan.status === "finished") {
          if (hasPremium(session.user)) {
            // Start sending data removal requests if the user has Plus:
            await optoutProfile(profileId);
          }

          const allScanResults = await getAllScanResults(profileId);
          await addOnerepScanResults(profileId, allScanResults);
        }

        return NextResponse.json(
          { success: true, status: scan.status },
          { status: 200 },
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
      logger.error(e);
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } else {
    // Not Signed in, redirect to home
    return NextResponse.redirect(AppConstants.SERVER_URL, 302);
  }
}
