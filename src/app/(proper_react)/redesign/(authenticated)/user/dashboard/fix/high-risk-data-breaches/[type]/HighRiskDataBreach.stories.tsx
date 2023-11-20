/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Meta, StoryObj } from "@storybook/react";
import {
  createRandomBreach,
  createUserWithPremiumSubscription,
} from "../../../../../../../../../apiMocks/mockData";
import { Shell } from "../../../../../../Shell";
import { getEnL10nSync } from "../../../../../../../../functions/server/mockL10n";
import { HighRiskBreachLayout } from "../HighRiskBreachLayout";
import { HighRiskBreachTypes } from "../highRiskBreachData";
import { BreachDataTypes } from "../../../../../../../../functions/universal/breach";
import { StepDeterminationData } from "../../../../../../../../functions/server/getRelevantGuidedSteps";
import { OnerepScanRow } from "knex/types/tables";

const user = createUserWithPremiumSubscription();

const mockedSession = {
  expires: new Date().toISOString(),
  user: user,
};

const HighRiskBreachWrapper = (props: {
  type: HighRiskBreachTypes;
  scanStatus?: "empty" | "not_started" | "unavailable";
  nextUnresolvedBreachType?: keyof typeof BreachDataTypes;
}) => {
  const hasNextUnresolvedBreach = props.nextUnresolvedBreachType !== null;
  const mockedBreaches = [...Array(5)].map(() =>
    createRandomBreach({
      isResolved: hasNextUnresolvedBreach,
    }),
  );

  // Ensure all high-risk data breaches are present in at least one breach:
  mockedBreaches.push(
    createRandomBreach({
      dataClassesEffected: [
        {
          [BreachDataTypes.SSN]: 42,
          [BreachDataTypes.CreditCard]: 42,
          [BreachDataTypes.BankAccount]: 42,
          [BreachDataTypes.PIN]: 42,
        },
      ],
      isResolved: hasNextUnresolvedBreach,
    }),
  );

  // Adds a breach with an unresolved breach type
  if (props.nextUnresolvedBreachType) {
    mockedBreaches.push(
      createRandomBreach({
        dataClassesEffected: [
          {
            [BreachDataTypes[props.nextUnresolvedBreachType]]: 42,
          },
        ],
        isResolved: false,
      }),
    );
  }

  const mockedScan: OnerepScanRow = {
    created_at: new Date(1998, 2, 31),
    updated_at: new Date(1998, 2, 31),
    id: 0,
    onerep_profile_id: 0,
    onerep_scan_id: 0,
    onerep_scan_reason: "initial",
    onerep_scan_status: "finished",
  };

  const data: StepDeterminationData =
    props.scanStatus === "empty"
      ? {
          countryCode: "us",
          latestScanData: { results: [], scan: mockedScan },
          subscriberBreaches: mockedBreaches,
          user: mockedSession.user,
        }
      : props.scanStatus === "not_started"
      ? {
          countryCode: "us",
          latestScanData: { results: [], scan: null },
          subscriberBreaches: mockedBreaches,
          user: mockedSession.user,
        }
      : {
          countryCode: "nl",
          latestScanData: null,
          subscriberBreaches: mockedBreaches,
          user: mockedSession.user,
        };

  return (
    <Shell
      l10n={getEnL10nSync()}
      session={mockedSession}
      nonce=""
      monthlySubscriptionUrl=""
      yearlySubscriptionUrl=""
    >
      <HighRiskBreachLayout
        subscriberEmails={[]}
        type={props.type}
        data={data}
      />
    </Shell>
  );
};

const meta: Meta<typeof HighRiskBreachWrapper> = {
  title: "Pages/Guided resolution/2. High-risk data breaches",
  component: HighRiskBreachWrapper,
};
export default meta;
type Story = StoryObj<typeof HighRiskBreachWrapper>;

export const SsnStory: Story = {
  name: "2a. Social Security Number",
  args: {
    type: "ssn",
  },
};

export const CreditCardStory: Story = {
  name: "2b. Credit card",
  args: {
    type: "credit-card",
  },
};

export const BankAccountStory: Story = {
  name: "2c. Bank account",
  args: {
    type: "bank-account",
  },
};

export const PinStory: Story = {
  name: "2d. PIN",
  args: {
    type: "pin",
  },
};

export const HighRiskBreachDonePasswordsNextStory: Story = {
  name: "2e I. Done (Next step: Passwords)",
  args: {
    type: "done",
    nextUnresolvedBreachType: "Passwords",
  },
};

export const HighRiskBreachDoneSecurityQuestionsNextStory: Story = {
  name: "2e II. Done (Next step: Security questions)",
  args: {
    type: "done",
    nextUnresolvedBreachType: "SecurityQuestions",
  },
};

export const HighRiskBreachDoneSecurityTipsNextStory: Story = {
  name: "2e III. Done (Next step: Security tips)",
  args: {
    type: "done",
    nextUnresolvedBreachType: "Phone",
  },
};

export const HighRiskBreachDoneNoNextStepStory: Story = {
  name: "2e IV. Done (Next step: None)",
  args: {
    type: "done",
  },
};
