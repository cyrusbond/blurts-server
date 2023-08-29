/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use client";

import { useEffect } from "react";
import { useGlean } from "../../../hooks/useGlean";

interface PageLoadProps {
  pageTitle: string;
}

// Empty component that records a page view on first load.
export const PageLoad = ({ pageTitle }: PageLoadProps) => {
  const { appEvents } = useGlean();

  // On first load of the page, record a page view.
  useEffect(() => {
    if (pageTitle) {
      appEvents.pageView.record({ label: pageTitle });
    }
  }, [appEvents, pageTitle]);

  // This component doesn't render anything.
  return <></>;
};
