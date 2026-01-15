const forgetPasswordTemplate = (otp, hostname) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <!-- styles unchanged -->
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead"></td>
            </tr>

            <!-- Email Body -->
            <tr>
              <td class="email-body" width="570">
                <table class="email-body_inner" align="center" width="570" role="presentation">
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
                        <h1>Hi Dear,</h1>

                        <p>
                          We have noticed a request from your side to reset the password
                          for your <strong>Gauswarn</strong> account.
                          The <strong>OTP</strong> to reset your password is
                          <strong>${otp}</strong>, which is
                          <strong>valid for the next 24 hours.</strong>
                        </p>

                        <table class="body-action" align="center" width="100%" role="presentation">
                          <tr>
                            <td align="center">
                              <table width="100%" role="presentation">
                                <tr>
                                  <td align="center">
                                    <a class="f-fallback button button--green" target="_blank">
                                      <b>${otp}</b>
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <p>
                          For security, this request was received from
                          <strong>${hostname}</strong> for Gauswarn.
                          If this wasn’t you, please ignore this email or contact support.
                        </p>

                        <p>
                          Thanks,<br />
                          The <strong>Gauswarn</strong> Team
                        </p>

                        <table class="body-sub" role="presentation">
                          <tr>
                            <td>
                              <p class="f-fallback sub">
                                If you’re having trouble with the button above,
                                you can safely ignore this email.
                              </p>
                            </td>
                          </tr>
                        </table>

                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td>
                <table class="email-footer" align="center" width="570" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="f-fallback sub align-center">
                        © Gauswarn
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

module.exports = { forgetPasswordTemplate };
