/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getMessage } from '../../utils/fluent.js'
import { formatDate } from '../../utils/format-date.js'

const breachAlertContainerStyle = `
  background: #f9f9fa;
  color: black;
  padding: 36px 0 24px;
`

const breachAlertTableStyle = `
  margin: auto
`

const breachAlertCardsContainerStyle = `
  background: white;
  border-radius: 6px;
  border-spacing: 0;
  border: 1px solid #eeeeee;
  box-shadow: 0 0 6px #dddddd;
  display: inline-table;
  margin: 12px;
  min-width: 240px;
  width: 30%;
`

const breachAlertCardsTitleStyle = `
  background: #eeeeee;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 12px;
`

const breachAlertCardsTitleImageStyle = `
  vertical-align: bottom;
`

const breachAlertLabelStyle = `
  color: #5e5e72;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 300;
  margin: 0px;
  padding-bottom: 4px;
`

const breachAlertValueStyle = `
  color: #20123a;
  font-family: sans-serif;
  font-size: 15px;
  font-weight: 600;
  margin: 0px;
  padding-bottom: 15px;
`

const breachAlertCtaStyle = `
  background: #0060df;
  border-radius: 4px;
  color: white;
  display: inline-block;
  margin: 24px 0;
  margin: auto;
  padding: 12px 24px;
`

const breachAlertEmailPartial = data => {
  const { breachAlert, breachedEmail, ctaHref, supportedLocales } = data
  const { LogoPath, AddedDate, DataClasses, Title } = breachAlert

  return `
    <tr>
      <td style='${breachAlertContainerStyle}'>
        <p>
          ${getMessage('email-breach-detected', {
            'email-address': `<strong>${breachedEmail}</strong>`
          })}
        </p>
        <table style='${breachAlertTableStyle}'>
          <tr>
            <td>
              <table style='${breachAlertCardsContainerStyle}'>
                <tr>
                  <td style='${breachAlertCardsTitleStyle}'>
                    <img
                      height='25'
                      src='${LogoPath}'
                      style='${breachAlertCardsTitleImageStyle}'
                      width='25'
                    >
                    ${Title}
                  </td>
                </tr>
                <tr>
                  <td style='padding: 24px;'>
                    <p style='${breachAlertLabelStyle}'>
                      ${getMessage('breach-added-label')}
                    </p>
                    <p style='${breachAlertValueStyle}'>
                      ${formatDate(AddedDate, supportedLocales)}
                    </p>

                    ${DataClasses?.length > 0
                      ? `
                          <p style='${breachAlertLabelStyle}'>
                            ${getMessage('compromised-data')}
                          </p>
                          <span style='${breachAlertValueStyle}'>
                            ${DataClasses.map(classKey => getMessage(classKey))
                              .join(', ')
                              .trim()}
                          </span>
                        `
                      : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <a
          href='${ctaHref}'
          style='${breachAlertCtaStyle}'
        >
          ${getMessage('email-dashboard-cta')}
        </a>
      </td>
    </tr>
  `
}

export { breachAlertEmailPartial }
