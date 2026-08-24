# Controlled Foundation Setup Checklist

This checklist is retained for the later G8/G9 release gate. M01.1 does not execute it.

1. Confirm approved source commit, test evidence, Rules hash and release tag.
2. Confirm production build uses the public Firebase Web configuration and emulator flag is false.
3. Preserve the current deny-all Rules and index files as rollback evidence.
4. Confirm no real or synthetic data is present in the repository/build.
5. Deploy only after explicit Commercial Manager release authorization.
6. Create Authentication/profile/configuration only through the approved technical-owner procedure.
7. Verify authorized CM read and every negative identity denial before data entry.
8. Keep GitHub Pages and App Check disabled until their specific approved step.

Never record credentials, reset codes, passwords, service-account keys or commercial data in this checklist.
