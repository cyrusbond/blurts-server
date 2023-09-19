/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import styles from "./DashboardTopBanner.module.scss";
import { TabType } from "./View";
import { Button } from "../../../../../components/server/Button";
import { useL10n } from "../../../../../hooks/l10n";
import { DoughnutChart as Chart } from "../../../../../components/client/Chart";
import { ProgressCard } from "../../../../../components/client/ProgressCard";
import { DashboardSummary } from "../../../../../functions/server/dashboard";
import { useRouter } from "next/navigation";
import PremiumButton from "../../../../../components/client/PremiumButton";
import { Scan } from "../../../../../functions/server/onerep";

export type BannerContent =
  | "ScanInProgressContent"
  | "LetsFixDataContent"
  | "DataBrokerScanUpsellContent"
  | "NoExposuresFoundContent"
  | "ResumeBreachResolutionContent"
  | "YourDataIsProtectedContent"
  | "YourDataIsProtectedAllFixedContent"
  | "NoContent";

export type DashboardTopBannerProps = {
  content: BannerContent;
  bannerData: DashboardSummary;
  scanStatus: Scan["status"];
  isEligibleForFreeScan: boolean;
  type: TabType;
  ctaCallback?: () => void;
};

export const DashboardTopBanner = (props: DashboardTopBannerProps) => {
  const l10n = useL10n();
  const router = useRouter();

  const isFixedTab = props.type === "fixed";
  const {
    totalExposures,
    dataBrokerFixedNum,
    dataBreachFixedNum,
    dataBreachTotalNum,
    dataBrokerTotalNum,
  } = props.bannerData;

  const chartDataKey = isFixedTab
    ? "fixedSanitizedExposures"
    : "sanitizedExposures";
  const chartData: [string, number][] = props.bannerData[chartDataKey].map(
    (obj) => {
      const [key, value] = Object.entries(obj)[0];
      return [l10n.getString(key), value];
    }
  );

  const dataBrokerCount = parseInt(
    process.env.NEXT_PUBLIC_ONEREP_DATA_BROKER_COUNT as string,
    10
  );

  const contentData = {
    ScanInProgressContent: {
      headline: l10n.getString("dashboard-top-banner-scan-in-progress-title"),
      description: (
        <>
          <p>
            {l10n.getFragment(
              "dashboard-top-banner-scan-in-progress-description",
              {
                vars: {
                  data_breach_total_num: totalExposures,
                },
                elems: {
                  b: <strong />,
                },
              }
            )}
          </p>
          <br />
          <p>
            {!totalExposures
              ? l10n.getString(
                  "dashboard-top-banner-scan-in-progress-fix-later-hint"
                )
              : l10n.getString(
                  "dashboard-top-banner-scan-in-progress-fix-now-hint"
                )}
          </p>
        </>
      ),
      cta: (
        <Button
          href={
            "/redesign/user/dashboard/fix/data-broker-profiles/view-data-brokers"
          }
          small
          variant="primary"
        >
          {l10n.getString("dashboard-top-banner-scan-in-progress-cta")}
        </Button>
      ),
      learnMore: null,
    },
    LetsFixDataContent: {
      headline: l10n.getString("dashboard-top-banner-protect-your-data-title"),
      description: l10n.getString(
        "dashboard-top-banner-protect-your-data-description",
        {
          data_breach_total_num: dataBreachTotalNum,
          data_broker_total_num: dataBrokerTotalNum,
        }
      ),
      cta: (
        <Button
          href={
            "/redesign/user/dashboard/fix/data-broker-profiles/view-data-brokers"
          }
          small
          variant="primary"
        >
          {l10n.getString("dashboard-top-banner-protect-your-data-cta")}
        </Button>
      ),
      learnMore: null,
    },
    DataBrokerScanUpsellContent: {
      headline: l10n.getString(
        "dashboard-top-banner-monitor-protects-your-even-more-title"
      ),
      description: l10n.getString(
        "dashboard-top-banner-monitor-protects-your-even-more-description",
        {
          data_broker_sites_total_num: dataBrokerCount,
        }
      ),
      cta: (
        <Button
          // Ignored for test coverage; to be implemented:
          /* c8 ignore next 3 */
          onClick={() => {
            router.push("/redesign/user/welcome");
          }}
          small
          variant="primary"
        >
          {l10n.getString(
            "dashboard-top-banner-monitor-protects-your-even-more-cta"
          )}
        </Button>
      ),
      learnMore: (
        <a href="https://mozilla.org/products/monitor/how-it-works/">
          {l10n.getString(
            "dashboard-top-banner-monitor-protects-your-even-more-learn-more"
          )}
        </a>
      ),
    },
    NoExposuresFoundContent: {
      headline: l10n.getString("dashboard-top-banner-no-exposures-found-title"),
      description: l10n.getString(
        "dashboard-top-banner-no-exposures-found-description",
        {
          data_broker_sites_total_num: dataBrokerCount,
        }
      ),
      cta: (
        <Button
          // Ignored for test coverage; to be implemented:
          /* c8 ignore next 3 */
          onClick={() => {
            // do something
          }}
          small
          variant="primary"
        >
          {l10n.getString("dashboard-top-banner-no-exposures-found-cta")}
        </Button>
      ),
      learnMore: null,
    },
    ResumeBreachResolutionContent: {
      headline: l10n.getString(
        "dashboard-top-banner-lets-keep-protecting-title"
      ),
      description: l10n.getString(
        "dashboard-top-banner-lets-keep-protecting-description",
        {
          remaining_exposures_total_num: totalExposures - dataBrokerFixedNum,
        }
      ),
      cta: (
        <Button
          // Ignored for test coverage; to be implemented:
          /* c8 ignore next 3 */
          onClick={() => {
            // do something
          }}
          small
          disabled
          variant="primary"
        >
          {l10n.getString("dashboard-top-banner-lets-keep-protecting-cta")}
        </Button>
      ),
      learnMore: null,
    },
    YourDataIsProtectedContent: {
      headline: l10n.getString(
        "dashboard-top-banner-your-data-is-protected-title"
      ),
      description: l10n.getString(
        "dashboard-top-banner-your-data-is-protected-description",
        {
          starting_exposure_total_num: totalExposures,
        }
      ),
      cta: (
        <Button
          // Ignored for test coverage; to be implemented:
          /* c8 ignore next 3 */
          onClick={() => {
            props?.ctaCallback?.();
          }}
          small
          variant="primary"
        >
          {l10n.getString("dashboard-top-banner-your-data-is-protected-cta")}
        </Button>
      ),
      learnMore: null,
    },
    YourDataIsProtectedAllFixedContent: {
      headline: l10n.getString(
        "dashboard-top-banner-your-data-is-protected-title"
      ),
      description: l10n.getString(
        "dashboard-top-banner-your-data-is-protected-all-fixed-description",
        {
          starting_exposure_total_num: totalExposures,
        }
      ),
      cta: (
        <PremiumButton
          label={"dashboard-top-banner-your-data-is-protected-all-fixed-cta"}
        />
      ),
      learnMore: null,
    },
    NoContent: null,
  };

  const content = contentData[props.content];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.explainerContentWrapper}>
          {content && !isFixedTab && (
            <div className={styles.explainerContent}>
              <h3>{content.headline}</h3>
              <p>{content.description}</p>
              {content.cta && <span className={styles.cta}>{content.cta}</span>}
              {content.learnMore && <p>{content.learnMore}</p>}
            </div>
          )}
          {isFixedTab && (
            <ProgressCard
              resolvedByYou={dataBreachFixedNum}
              autoRemoved={dataBrokerFixedNum}
              totalNumExposures={totalExposures}
            />
          )}
        </div>
        <div className={styles.chart}>
          <Chart
            scanStatus={props.scanStatus}
            data={chartData}
            isEligibleForFreeScan={props.isEligibleForFreeScan}
          />
        </div>
      </div>
    </>
  );
};
