/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { NextRequest, NextResponse } from "next/server";
import { verifyEmailHash } from "../../../../../db/tables/emailAddresses.js";
export async function POST(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams;
    const token = query?.["token"];
    await verifyEmailHash(token);
    return NextResponse.redirect("/user/settings", 301);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}