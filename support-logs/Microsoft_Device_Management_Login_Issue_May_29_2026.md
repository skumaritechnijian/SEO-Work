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

