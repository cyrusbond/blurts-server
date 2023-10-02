/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { DashboardTopBannerProps } from ".";
import styles from "./DashboardTopBannerContent.module.scss";
import {
  UserDashboardState,
  getUserDashboardState,
} from "../getUserDashboardState";
import {
  StepLink,
  getRelevantGuidedSteps,
} from "../../../../../../functions/server/getRelevantGuidedSteps";
import { ProgressCard } from "../../../../../../components/client/ProgressCard";
import { Button } from "../../../../../../components/server/Button";
import { useL10n } from "../../../../../../hooks/l10n";
import PremiumButton from "../../../../../../components/client/PremiumButton";

export interface ContentProps {
  relevantGuidedStep: StepLink;
  hasExposures: boolean;
  hasUnresolvedBreaches: boolean;
  hasUnresolvedBrokers: boolean;
  isEligibleForFreeScan: boolean;
  isEligibleForPremium: boolean;
  isPremiumUser: boolean;
  scanInProgress: boolean;
  onShowFixed: () => void;
}

export const DashboardTopBannerContent = (props: DashboardTopBannerProps) => {
  const l10n = useL10n();

  const {
    tabType,
    bannerData,
    stepDeterminationData,
    hasExposures,
    hasUnresolvedBreaches,
    hasUnresolvedBrokers,
    isEligibleForFreeScan,
    isEligibleForPremium,
    isPremiumUser,
    scanInProgress,
    onShowFixed,
  } = props;

  if (tabType === "fixed") {
    return (
      <ProgressCard
        resolvedByYou={bannerData.dataBreachFixedNum}
        autoRemoved={bannerData.dataBrokerFixedNum}
        totalNumExposures={bannerData.totalExposures}
      />
    );
  }

  const relevantGuidedStep = getRelevantGuidedSteps(
    stepDeterminationData
  ).current;

  // There should be a relevant next step for every user (even if it's just
  // going back to the dashboard), so we can't hit this line in tests (and
  // shouldn’t be able to in production either):
  /* c8 ignore next 3 */
  if (relevantGuidedStep === null) {
    return null;
  }

  const contentProps = {
    relevantGuidedStep,
    hasExposures,
    hasUnresolvedBreaches,
    hasUnresolvedBrokers,
    isEligibleForFreeScan,
    isEligibleForPremium,
    isPremiumUser,
    scanInProgress,
    onShowFixed,
  };
  const userDashboardState = getUserDashboardState(contentProps);

  function getDashboardBannerContent({
    userDashboardState,
    relevantGuidedStep,
  }: {
    userDashboardState: UserDashboardState;
    relevantGuidedStep: StepLink;
  }) {
    switch (userDashboardState) {
      case "NonEligiblePremiumUserNoBreaches":
        return (
          <>
            <div>{"1"}</div>
            <h3>
              {l10n.getString("dashboard-top-banner-no-exposures-found-title")}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-non-us-no-exposures-found-description"
              )}
            </p>
            <div className={styles.cta}>
              <Button href="/redesign/user/settings" small variant="primary">
                {l10n.getString("dashboard-top-banner-monitor-more-cta")}
              </Button>
            </div>
          </>
        );
      case "NonEligiblePremiumUserUnresolvedBreaches":
        return (
          <>
            <div>{"3"}</div>
            <h3>
              {l10n.getString("dashboard-top-banner-protect-your-data-title")}
            </h3>
            <p>
              {l10n.getFragment(
                "dashboard-exposures-breaches-scan-progress-description",
                {
                  vars: {
                    exposures_total_num: bannerData.totalExposures,
                    data_breach_total_num: bannerData.dataBreachTotalNum,
                  },
                  elems: {
                    b: <strong />,
                  },
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString("dashboard-top-banner-protect-your-data-cta")}
              </Button>
            </div>
          </>
        );
      case "NonEligiblePremiumUserResolvedBreaches":
        return (
          <>
            <div>{"5"}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-your-data-is-protected-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-non-us-your-data-is-protected-description",
                {
                  exposures_resolved_num:
                    bannerData.totalExposures -
                    bannerData.dataBreachFixedNum -
                    bannerData.dataBrokerFixedNum,
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button
                onPress={() => {
                  contentProps.onShowFixed();
                }}
                small
                variant="primary"
              >
                {l10n.getString(
                  "dashboard-top-banner-your-data-is-protected-cta"
                )}
              </Button>
            </div>
          </>
        );
      case "UsUserNonPremiumWithoutScan":
        return (
          <>
            <div>{"8, 10, 12"}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-monitor-protects-your-even-more-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-monitor-protects-your-even-more-description",
                {
                  data_broker_sites_total_num: parseInt(
                    process.env.NEXT_PUBLIC_ONEREP_DATA_BROKER_COUNT as string,
                    10
                  ),
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString(
                  "dashboard-top-banner-monitor-protects-your-even-more-cta"
                )}
              </Button>
            </div>
            <br />
            <a href="https://mozilla.org/products/monitor/how-it-works/">
              {l10n.getString(
                "dashboard-top-banner-monitor-protects-your-even-more-learn-more"
              )}
            </a>
          </>
        );
      case "UsUserNonPremiumNoExposures":
        return (
          <>
            <div>{"13"}</div>
            <h3>
              {l10n.getString("dashboard-top-banner-no-exposures-found-title")}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-no-exposures-found-description",
                {
                  data_broker_sites_total_num: parseInt(
                    process.env.NEXT_PUBLIC_ONEREP_DATA_BROKER_COUNT as string,
                    10
                  ),
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString("dashboard-top-banner-no-exposures-found-cta")}
              </Button>
            </div>
          </>
        );
      case "UsUserNonPremiumWithScanUnresolvedExposures":
        return (
          <>
            <div>{"15, 17, 23"}</div>
            <h3>
              {l10n.getString("dashboard-top-banner-protect-your-data-title")}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-protect-your-data-description",
                {
                  data_breach_total_num: bannerData.totalExposures,
                  data_broker_total_num: bannerData.dataBrokerTotalNum,
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString("dashboard-top-banner-protect-your-data-cta")}
              </Button>
            </div>
          </>
        );
      case "UsUserNonPremiumWithScanRemovalInProgress":
        return (
          <>
            <div>{"16, 18, 20, 31"}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-lets-keep-protecting-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-lets-keep-protecting-description",
                {
                  remaining_exposures_total_num:
                    bannerData.totalExposures -
                    bannerData.dataBreachFixedNum -
                    bannerData.dataBrokerFixedNum,
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString(
                  "dashboard-top-banner-lets-keep-protecting-cta"
                )}
              </Button>
            </div>
          </>
        );
      case "UsUserNonPremiumWithScanAllResolved":
        return (
          <>
            <div>{"21, 28, 36"}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-your-data-is-protected-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-your-data-is-protected-all-fixed-description",
                {
                  starting_exposure_total_num: bannerData.totalExposures,
                }
              )}
            </p>
            <div className={styles.cta}>
              <PremiumButton
                label={
                  "dashboard-top-banner-your-data-is-protected-all-fixed-cta"
                }
              />
            </div>
          </>
        );
      case "UsUserPremiumOrNonPremiumWithScanUnresolvedExposures":
        return (
          <>
            <div>{"24, 27, 31, 32, 35, 45, 48 "}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-lets-keep-protecting-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-lets-keep-protecting-description",
                {
                  remaining_exposures_total_num:
                    bannerData.totalExposures -
                    bannerData.dataBreachFixedNum -
                    bannerData.dataBrokerFixedNum,
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString(
                  "dashboard-top-banner-lets-keep-protecting-cta"
                )}
              </Button>
            </div>
          </>
        );
      case "UsUserPremiumWithScanNoExposures":
        return (
          <>
            <div>{"43"}</div>
            <h3>
              {l10n.getString("dashboard-top-banner-no-exposures-found-title")}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-no-exposures-found-description",
                {
                  data_broker_sites_total_num: parseInt(
                    process.env.NEXT_PUBLIC_ONEREP_DATA_BROKER_COUNT as string,
                    10
                  ),
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button href="/redesign/user/settings" small variant="primary">
                {l10n.getString("dashboard-top-banner-monitor-more-cta")}
              </Button>
            </div>
          </>
        );
      case "UsUserPremiumWithScanAllResolved":
        return (
          <>
            <div>{"49"}</div>
            <h3>
              {l10n.getString(
                "dashboard-top-banner-your-data-is-protected-title"
              )}
            </h3>
            <p>
              {l10n.getString(
                "dashboard-top-banner-your-data-is-protected-description",
                {
                  starting_exposure_total_num: bannerData.totalExposures,
                }
              )}
            </p>
            <div className={styles.cta}>
              <Button
                onPress={() => {
                  contentProps.onShowFixed();
                }}
                small
                variant="primary"
              >
                {l10n.getString(
                  "dashboard-top-banner-your-data-is-protected-cta"
                )}
              </Button>
            </div>
          </>
        );
      case "UsUserPremiumScanInProgressNoExposures":
        return (
          <>
            <h3>
              {l10n.getString("dashboard-top-banner-scan-in-progress-title")}
            </h3>
            <p>
              {l10n.getFragment(
                "dashboard-top-banner-scan-in-progress-description",
                {
                  vars: {
                    data_breach_total_num: bannerData.totalExposures,
                  },
                  elems: {
                    b: <strong />,
                  },
                }
              )}
              <br />
              <br />
              {l10n.getString(
                "dashboard-top-banner-scan-in-progress-fix-later-hint"
              )}
            </p>
          </>
        );
      case "UsUserPremiumScanInProgressUnresolvedExposures":
        return (
          <>
            <h3>
              {l10n.getString("dashboard-top-banner-scan-in-progress-title")}
            </h3>
            <p>
              {l10n.getFragment(
                "dashboard-top-banner-scan-in-progress-description",
                {
                  vars: {
                    data_breach_total_num: bannerData.totalExposures,
                  },
                  elems: {
                    b: <strong />,
                  },
                }
              )}
              <br />
              <br />
              {l10n.getString(
                "dashboard-top-banner-scan-in-progress-fix-now-hint"
              )}
            </p>
            <div className={styles.cta}>
              <Button href={relevantGuidedStep.href} small variant="primary">
                {l10n.getString("dashboard-top-banner-scan-in-progress-cta")}
              </Button>
            </div>
          </>
        );
      default:
        // The above conditions should always match one of the possible dashboard states.
        console.warn("No matching condition for dashboard state found.");
        return null;
    }
  }

  return (
    <div className={styles.explainerContent}>
      <pre>{JSON.stringify(contentProps, null, 2)}</pre>
      {getDashboardBannerContent({ userDashboardState, relevantGuidedStep })}
    </div>
  );
};
