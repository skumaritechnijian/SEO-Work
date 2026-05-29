# Microsoft Device Management Login Issue - May 29, 2026

## Account

`skumari@technijian.com`

## Screenshot Error

Microsoft sign-in showed:

> Device management could not be enabled

Troubleshooting details included:

- Error Code: `-2145910760`
- Message: `There was an error with your Mobile Device Management (MDM) user license. Contact your system administrator.`

## Local Device Check

`dsregcmd /status` showed:

- `AzureAdJoined : NO`
- `EnterpriseJoined : NO`
- `DomainJoined : NO`
- `WorkplaceJoined : NO`
- `AzureAdPrt : NO`

## Finding

The local device is not currently joined or workplace registered, so this does not appear to be a stuck local registration issue.

The error indicates a Microsoft tenant-side licensing/configuration issue. The user account likely needs an Intune/MDM-capable license assigned, or the tenant's automatic MDM enrollment scope needs to exclude this user if device management is not required.

## Resolution Paths

### If Full Device Management Is Required

A Microsoft 365/Entra/Intune administrator should:

1. Confirm `skumari@technijian.com` has an Intune/MDM-capable license.
2. Confirm the user is in the correct MDM enrollment scope.
3. Confirm enrollment restrictions allow this device/platform.
4. Retry device registration after licensing is applied.

### If Only App Login Is Required

During Microsoft sign-in, choose:

`No, sign in to this app only`

This avoids device management enrollment and allows login to supported apps such as Outlook, Teams, Office, or OneDrive when tenant policy permits app-only sign-in.

## Local Action Taken

Opened Windows settings:

`Settings > Accounts > Access work or school`

## May 29 Follow-Up

The same Microsoft dialog appeared again for `skumari@technijian.com`:

> Device management could not be enabled

`dsregcmd /status` was checked again and still showed:

- `AzureAdJoined : NO`
- `EnterpriseJoined : NO`
- `DomainJoined : NO`
- `WorkplaceJoined : NO`
- `AzureAdPrt : NO`

This confirms there is still no local Azure AD join or Workplace Join state to remove. The PC is not stuck in a partial local enrollment.

Additional local action taken:

- Opened `Settings > Accounts > Email & accounts`
- Opened `Settings > Accounts > Access work or school`

## Required User/Admin Action

If the goal is only to sign in to Microsoft apps, add the account from:

`Settings > Accounts > Email & accounts > Add a work or school account`

When Microsoft prompts for device management, choose:

`No, sign in to this app only`

If that option is not shown, or if the tenant forces device management, then a Microsoft 365 administrator must assign an Intune/MDM-capable license to `skumari@technijian.com` or remove this user from forced MDM enrollment scope.

This cannot be fixed only from local Windows settings because the error is returned by Microsoft cloud enrollment policy/licensing.

## May 29 Second Follow-Up

The same error appeared again.

Latest troubleshooting details from the Microsoft dialog:

- Error Code: `-2145910760`
- Request Id: `7b94b2c8-4c11-4d7c-87db-88c97d585100`
- Correlation Id: `3dfb2021-4713-4d13-adf4-78cc0e5fc9f0`
- Timestamp: `2026-05-29T15:07:43.462Z`
- Message: `There was an error with your Mobile Device Management (MDM) user license.`

Local `dsregcmd /status` was checked again and still showed no local join:

- `AzureAdJoined : NO`
- `EnterpriseJoined : NO`
- `DomainJoined : NO`
- `WorkplaceJoined : NO`
- `AzureAdPrt : NO`

The local setting page opened again:

`Settings > Accounts > Email & accounts`

Conclusion remains unchanged: Windows is not blocking the account locally. Microsoft cloud enrollment is rejecting the sign-in because the user does not have the required MDM/Intune license or is in a forced MDM scope without an eligible license.

Required admin fix:

1. Go to Microsoft 365 admin center or Entra admin center.
2. Open user `skumari@technijian.com`.
3. Assign an Intune/MDM-capable license, such as Microsoft Intune Plan 1, Microsoft 365 Business Premium, or another plan that includes Intune.
4. Confirm the user is allowed by MDM user scope in Entra ID Mobility (MDM and WIP).
5. Retry Windows work/school account setup.

If device management is not required, use app-only sign-in and avoid the device enrollment path.

## May 29 Login Request

User requested login with:

`skumari@technijian.com`

Local action taken:

- Opened `Settings > Accounts > Email & accounts`

Recommended path:

1. Click `Add a work or school account`.
2. Sign in with `skumari@technijian.com`.
3. Complete password and MFA manually.
4. If Microsoft asks to manage the device, choose `No, sign in to this app only`.

Reason:

The full device-management enrollment path is blocked by the Microsoft tenant error:

`There was an error with your Mobile Device Management (MDM) user license.`

Until the Microsoft 365/Intune license or MDM enrollment scope is fixed by an administrator, local Windows settings cannot complete full device registration.

## May 29 Outlook Mail Open Request

User requested opening the email account:

`skumari@technijian.com`

Local action taken:

- Opened Outlook on the web: `https://outlook.office.com/mail/`

User must complete password and MFA manually.

If Microsoft prompts for device management again, choose app-only sign-in where available. Full device management remains blocked until the MDM license issue is fixed by the Microsoft 365/Intune administrator.
