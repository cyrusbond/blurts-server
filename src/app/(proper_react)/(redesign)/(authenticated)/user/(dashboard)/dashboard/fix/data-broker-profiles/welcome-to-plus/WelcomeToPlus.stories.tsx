/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Meta, StoryObj } from "@storybook/react";
import { OnerepScanRow } from "knex/types/tables";
import { WelcomeToPlusView } from "./WelcomeToPlusView";
import {
  createRandomBreach,
  createRandomScanResult,
  createUserWithPremiumSubscription,
} from "../../../../../../../../../../apiMocks/mockData";
import { Shell } from "../../../../../../../Shell";
import { getOneL10nSync } from "../../../../../../../../../functions/server/mockL10n";
import { LatestOnerepScanData } from "../../../../../../../../../../db/tables/onerep_scans";

const mockedScan: OnerepScanRow = {
  created_at: new Date(1998, 2, 31),
  updated_at: new Date(1998, 2, 31),
  id: 0,
  onerep_profile_id: 0,
  onerep_scan_id: 0,
  onerep_scan_reason: "initial",
  onerep_scan_status: "finished",
};

function getMockedScanData(brokerScanCount: number): LatestOnerepScanData {
  return {
    scan: mockedScan,
    results: [...Array(brokerScanCount)].map(() =>
      createRandomScanResult({ status: "new", manually_resolved: false }),
    ),
  };
}

const mockedBreaches = [...Array(5)].map(() => createRandomBreach());

const user = createUserWithPremiumSubscription();

const mockedSession = {
  expires: new Date().toISOString(),
  user: user,
};

const WelcomeToPlusViewWrapper = (props: { brokerScanCount: number }) => {
  return (
    <WelcomeToPlusView
      data={{
        countryCode: "us",
        latestScanData:
          props.brokerScanCount > 0
            ? getMockedScanData(props.brokerScanCount)
            : null,
        subscriberBreaches: mockedBreaches,
        user: mockedSession.user,
      }}
      l10n={l10n}
      subscriberEmails={[]}
    />
  );
};

const meta: Meta<typeof WelcomeToPlusViewWrapper> = {
  title: "Pages/Guided resolution/1e. Welcome to Plus",
  component: WelcomeToPlusViewWrapper,
  argTypes: {
    brokerScanCount: {
      control: { type: "number", min: 0 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof WelcomeToPlusViewWrapper>;

const l10n = getOneL10nSync();

export const WelcomeToPlusViewStory: Story = {
  name: "1e. Welcome to Plus",
  render: (props) => {
    return (
      <Shell l10n={l10n} session={mockedSession} nonce="">
        <WelcomeToPlusViewWrapper brokerScanCount={props.brokerScanCount} />
      </Shell>
    );
  },
};
