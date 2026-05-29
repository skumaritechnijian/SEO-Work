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
