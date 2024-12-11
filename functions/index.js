/* eslint-disable promise/no-nesting */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const html_to_pdf = require('html-pdf-node');

const axios = require('axios')
const accountSid = 'ACbde8c1939cdf1f5b44e8040498ad72f0';
const authToken = 'bc336d379bcc9860e8b5a7b067daadc3';

const algoliasearch = require("algoliasearch");

const algoliaApplicationID ='0DXTUWO9PQ'
const algoliaAdminKey ='9b56b21daf3caa243e2f3e2610d97522'
const client = algoliasearch(algoliaApplicationID, algoliaAdminKey);

const index = client.initIndex("Questions_Search");
const quizIndex = client.initIndex("Quiz_Search");
const packageIndex = client.initIndex("Package_Search");
const bookIndex = client.initIndex("Book_Search");
const studentIndex = client.initIndex("Student_Search");
const batchIndex = client.initIndex("Batch_Search");
const couponIndex = client.initIndex("Coupon_Search");
const invoiceIndex = client.initIndex("Invoice_Search");
const discountIndex = client.initIndex("DocumentRequest_Search");
const adminUserIndex = client.initIndex("Admin_User_Search");
const enquiryIndex = client.initIndex("Enquiry_Search");
const mediaCenterIndex = client.initIndex("MediaCenter_Search");


const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto') 

const Razorpay = require('razorpay')

const instance = new Razorpay({
  
  // key_id: 'rzp_test_RUudyt08dhMKpE',
  // key_secret: '15VA3lBjmLk2I7Nc9dQgBBzZ',

  key_id: 'rzp_live_M4SWZ4UFoAANKG',
  key_secret: 'XDAE3uB4ZnLfU3lALLR7CpYJ',
});

const sendGridConfig = (to, from, sub, msg,attachments=[]) => {
  // let data = JSON.stringify({
  //   "personalizations":
  //     [
  //       {
  //         "to":
  //           [
  //             { "email":  to}
  //           ]
  //       }
  //     ],
  //   "from": { "email": from },
  //   "subject": sub,
  //   "content": [
  //     {
  //       "type": "text/html",
  //       "value": msg
  //     }
  //   ],
  // });

  let data = JSON.stringify({
    "to": to,
    "subject": sub,
    "html": msg
  });

  return {
    method: 'post',
    url: 'https://mailer.tncollege.online/send-email/noreply',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  // return {
  //   method: 'post',
  //   url: 'https://api.sendgrid.com/v3/mail/send',
  //   headers: {
  //     'Authorization': 'Bearer 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',
  //     'Content-Type': 'application/json'
  //   },
  //   data: data
  // };

}


const bulkSendGridConfig = (to, from, sub, msg) => {
  let data = JSON.stringify({
    "personalizations":
      [
        {
          "to": to
        }
      ],
    "from": { "email": from },
    "subject": sub,
    "content": [
      {
        "type": "text/plain",
        "value": msg
      }
    ]
  });

  return {
    method: 'post',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      'Authorization': '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',
      'Content-Type': 'application/json'
    },
    data: data
  };

}

exports.addSystemUser = functions.https.onCall((data, context) => {

  try {
    const { email, disabled, password, mobile } = data;
    return admin
      .auth()
      .createUser({ email, password, disabled, phoneNumber: "+91" + mobile })
      .then(async (res) => {
        await admin.auth().setCustomUserClaims(res.uid, { admin: true });
        return res;
      })
      .then((res) => {
        return {
          hasError: false,
          message: `Success! user has been created.`,
          user: res,
        };
      })
      .catch((error) => {
        return { hasError: true, message: error };
      });
  } catch (error) {
    return { hasError: true, message: error };
  }
});

exports.addStudentUser = functions.https.onCall((data, context) => {
  try {
    console.log('dataaaa', data)
    const { email, disabled, password, firstname, lastname, mobile, sendEmail, sendSMS } = data;
    return admin
      .auth()
      .createUser({
        email,
        disabled,
        password,
        emailVerified: false,
        phoneNumber: "+91" + mobile,
      })
      // .then(async (res) => {
      //   const link = await admin.auth().generatePasswordResetLink(email);
      //   return {res, link};
      // })
      .then((res) => {
        admin.auth().generateEmailVerificationLink(email).then(verifyLink=>{
        console.log(verifyLink)
        let config = sendGridConfig(email, 'noreply@tncollege.online', `Verify your Email for TN College`,     
              `<html> 
                <body>
                <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACQCAYAAAA4CJinAAAAAXNSR0
                    IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAJweSURBVHhe7L0FeF
                    TJFi0c7066O+4eIMEdAgFC3N3d3V2Jh5AQCO7u7u7u7u7uEBxm7l3/rhNgmLkwwzDM3Pv+9/b31d
                    d2+pySVWuvXadOlRj+n/0/+0b7f2D5f/bN9n8lWJ7cuYejazbjxKrNOLlhG3av3YSdm3di85btWL
                    V+M9Zu2IoNG7dh9doN2Lx5Mw5s3Yb99P7JvfsfzvB/p/1fA5bbFy5j17I1WDdjHoak5CK5iyWSWv
                    dEfMc+8GzfHb3adkD7dh3QrkNXtGnTiUvt6bueHTvBo3N3hHTshvLgUCwcMQLrZs7E6f0HPpz5/x
                    77/yVYfv7pJ5w5dBjbVq7C5iXLsH7eQhQGhMO/fQ94m3SAm6YRnGWU4SGuABcZFZjyFaEpLg05GT
                    54ckKIi0lDQkwCQj4PmrI8dJEVwl5OAV4CRYRpaCOhmQmKLO2xceosrJ8zHyvnzseW9Rtx5thJ/P
                    zzzx9y8f8/+/8FWBqfPcP506dx8vBh7N26FYunT0ektS1sDZrBpXlLOOg1g61OM/RR0YapUBFm0n
                    IEEnkEyCjBg6cMd/0WiHZyRVRYOEKjIhEeGknvIxAXGQZf675w0tWl4wQIkOIhTJqPKGkBQsQF8J
                    dVg52iJnpp6aGHSSv42zhiyZQZOLp1Jy4ePo5rp8/ixbPGD7n8P9/+jwVL46MnuHXxMi4eO4FJNX
                    WItbZDcPeesNbTh6mSMropKMJcSwcJ9o7YtXYdDm7djv1btqE8Lg721PjOIkX4yCnCS0kDA+IScf
                    PSJdy+dQu3bt/GnTt3cY/SXXo/bXgDAlu3hJuUNHzFxBEiKY04WXmES4vgJi4HG5EK7Ilp3Lubwq
                    VjF3g0a4swk87I7GWLbDtXTB0wEOePHcPNixfR+PDhh9z/n2n/x4Dl3//+N54+fYr7d+/i9rXrGJ
                    VbjNTeNggyMIGbSBVOsgpwIFdhzpODqUCIiL4W2LxyJc4ePcL996Pdu3UTE6rLEda2NZwFIrhraW
                    PBuLHcb+y4y1eu4uKFi7h88RKuEIAGlxbDRVcLzhIS8Kbkz+MhRKiAAJEy4jp2xqYFi7Bj9RqcIg
                    1zZPsO7Fm5BvUhUQhQ04OHvCrcVNTgZWiE5N59MD4rGw9v3sTjO3fw8snTX+Xr/wT7nwfLv//1b7
                    x68RJ3rt9ESVo2Ih1d4N6yDfpQQ1vJyMKekjtpCi+hPFwp2QiFiOzVC4e3beMa483LV3j66DGeUK
                    9+9uQJ/vWvf+HZw/uYW9sfAYYGsFJVwdxxY7hr/URax7h1e2gpaKAV6ZqWmtpooSCAuUAO7tLS8J
                    KQhIe0DFwIjCm9e+PAuvXc/5i9pjx+bPzbZ89hSHAYojV1EKGiCm8eH+6UPBTkkdm9G0qI7SalZe
                    Hh9Rt4++IFlfFf3P/+1+1/FiysUd+9fYcbl66iJjEbYd37ortACTbUAB4GBrBXVoSdggh9ZKRgwZ
                    eEjZw0zPlSsFdTwfxhwz6dY0ppf7h36AHrFm0RZGGDG5cvc43aeO8ehiYnwUxZCTPHjPx0fGlJBY
                    rSclFTUAYvcyu0JXdmL69E+kREglgKDlIy8NLXx5Lx47j/sHO9ogYfnpGNB+TG3r95w313afduFL
                    Vvjwi+LKJl5RAuL4S3PB+eIlmEq6ohSlMXeT16YXJyKu5euoz3b9/+z4PmfxIsrNEun72AqrQ8eH
                    YyQ08RCUl1Xdjr6GBsTg72zpyGASH+sFRRRE+BJPoIJWGlwIcFNYaLvg5WTZncdB6KTIJ69EU7Er
                    JdKHWSVUJZbCyePX7E/X7q0CF0o4abNnIU9/m3dmjzVgSZ9oIdXwGeEgL4yIhgzxcixrwPLhw9zI
                    HiHTWyhbYOrJTJFaqqY3xMFF49fYLGc2cx3sEBIdI8BPBkySWJKExvhyo/Xwzy9cewwGBEt24NFz
                    VVRFPIPjY+CbfOnOEiuY8M9b9m/1NgYZXE0q4Nm+Bu3BrWfBFc1LUQYmaGyrgY7Jw399Nx62dOhG
                    NrA3RXkoGprCR6ykiit6wMHHW1sXDMaO44BpZQK1sCiSIcRZqw4SkizcoeD0kzMDt++AjaaRti6p
                    gJn679eVo9bxGcW3aAk0ATvjxVOIiRoCW9Mm/kCO7/rGEHhobCTFIC7kpKcOTLIL21CbmXa3hEof
                    t4Et2+BC53TS1UUqR1klzj57Zo9EiEdu0AH2I3H9JCcc2NMDQ6HBcO7ueu/79m/1Ng2bhsFezbd0
                    E7WQG5FlmEkmbYPHXarxqQ2aSKEtg000JLGXF0FsrATMAjYUuvFLHYqKlhwagmpmBg8aAopTNFL5
                    5KWnDiKSC2iynuk8hkdujgQWirqGPymIlcw88dNwNtjFpBjXSGvpYWdCkPLcWlYU8gY2Cxl5CDA2
                    mclR+Yi/1nSHAonOUE8FJUgiuBxY/SgC5dMbK7GbLVtBGsqoHVU6b8Kv8fjX0+vHYl8ky7IVIkjy
                    DSQ648aUR0aIMtixd8OOp/x/4nwLJp1SrkhkfC0aQVeomU0ENagF48AVZMnvrJj7OGmdOvHAUUjr
                    qpaSKgeTP4UE+0Iu3SS0oSfSWlYCnFg4OiKmYPauD+w9xZiqs72hKI7IkRnOUVkGNrg0cfmOUouR
                    IjYqJxY8ZwDffm9WtokAiVERODSFwc6vTahpKznBwxhBwcxSWIoeSxeExT9MTyVOPhC3eBKoK1DO
                    CvrIYMIxPUtuuCUg1DJFKEtnXKr8swJiMDFb6+mJSby31m1923dAkSTFoiQEoO0TIK8JeTh59xM5
                    REhmLLkkXcf/8X7L8KFlZR8yZMgHfPbjDXVoOZUJbYQQrmknxYClWxcdFS7jhWqTvmLYStqjYSOn
                    bHnJQsPH/0CFvGTURUi1awl5aFA/3HSoz0CwnQpD59cW7vXu78b0lwFoeFIrhTOxS7O+Hu1Svc93
                    dv30JKTCS01JQJLE1ui0VDKuqKkJESgwpPDMZ8MXSXEYObQJqYRQpuYgQWaT6BcTB3/M8//YxhsQ
                    nkhvgwJwEcZNgcdy5e5ETurgmTUUau9MyGDdyxTMDOr6qAL2mbKB1duCopYuGwQXj/7h3HgEtHjo
                    a3uBzipJUQr6AOb3UV2FJewrt3xryGBhxZt4UD/3/T/itgYZV8Yt0OzKtpgL+hMaxFcrBWFcBJSx
                    n21LPZ0HpfviJyPANx/dxFrnGfP36MibW1ePH0Gd6/esV9d2jWfCQbtqIohcJnMT5pCmn0JcA4KK
                    ugJiICt86d4Y57/fIlnj99ilfPn3O9/On9+xhbWYXOevrQVlTEmJEj8dPPP2HawrmQVpaBuFAMPE
                    kx6EuLwYwA40juzkdCHN7EMg7EOAmWvXHy0D7u3C+fPcOovByURoThztWr3Pnf0vnnpWWgf+9euL
                    p/L1fmV42NiDYyRLCMAEnKmvAk0Ts8MQrviM2Y7aSOEUQMFSopIGCSINZUgl9zXdjJ8RGoa4gie0
                    86ZhXXcf5b9o+DhUUPK6fNRVJHS/gKteAnr4p6VxdcPHoEa8aNxABvLwQbGMNcWh62KvpYOXUW9z
                    +u0QkkzE7s24f1c+aizM4F4Ypa8JUScWBxpR7uSCxjRb3fU08PAxNicPbIQe6/zB7ev4P9O7ZiUE
                    EBbKnXG9CxqjKysO1rg+qBdTDq0hZiAnGIicQgSWDRpWRKLONMKZhC9AByd04SYrBT4SMr0BVXzp
                    7gzs1A2PjkyafrXKYoqrxbDwywtcat40e57xioPEiLxfKVyT2pIoDE+/jURLx70wSWXQSWEGIUP2
                    KoqBZGWDh4AK6dOoFh7p4IkKfv1YxIy/TGssmzuDr8b9g/Bpb3b9/hyrFTmDtqHBwNTGBDFRBu0h
                    aXjxzFUxKcrKLfvXqJx7duYlZNHeyo4kwl5VAQHI4HHzQGO+bYnj2Is7SCq7YeQvSao6y3JSrMrR
                    BGn+0lpMgdScNBQhruVOkh+gZIszDHxgXzsW7pUuQnRcOuc3t0VFVFC9JE2hI8KEjIQE5GCHHqzW
                    IUTckoykGMGEUkLQ4jAkZXcTG4yEgjkAS0H0U9XgQcd6E43DQE6OftgIPr1uDygf24few4ru/dj9
                    Or1mF2WByy1PQw1MYe906e4PL+8lkjfJQ0EEhuJlRKGaHKOrh64gTnWl7df4DpKZnwlhUi0qQFlo
                    1owOvnjVx5H128hIyW3UgXUTQn1IAjCfA54yfi/Kkz3DjUP2n/CFjev36DQyvWIc/aFdZK6uhOYW
                    JoD1OcoWiEVcjDu3dw4fQZXGf3Z4jKF5L/DmrXAb0VFGCpr4uFU5uiD0bxZeHhCOncBVsWLcbpPX
                    tx89Qp3D59GlNKS2BJrsKORKgHASCIJ49QOUW4E8tYUGO34UvDSFYKetISxBiSMOQLoEO9WyTJA0
                    9aDhIyfEr0XiSANLkabT4PLeh8XcQlYUe/eZPA9ZWWJsCI0bklECQjAT+eJMJI8+R1aIfqHmbo36
                    o9KhS0US2rgQK+Kmo6dMWlXbu4vL99+Qr17v4I1zSmxjfFMJ9w/Pz+PffbmaUrUNyiDUI01DCzpp
                    KA9YT7ntm/fv4XSizdKCJTRV8Sv93khOiqroZwO2dsI2C+pbr9p+xvBwsTdgdWrEZuLxt4K6rDma
                    ISK0V5DM5K54Dy7NFjFMXGw6ldV4SY2yE/KAxLJ03C3vXrMLK8BGZ6GihLiKeeRnqDjj976CCObt
                    /+Sey9efGCE63T6mpgSYBwlJGBD7FGiIwI4aR7PMnN2BA4u4v4MJGVhgE1sBa5E22KcNQFQvCJiS
                    QpPJYkUEmxROAQiktBl85hRO87SfGpkQRwYTcdeXLwIZEbRr8nksuLJSaLE8rDn0AVSCmZxHUVhe
                    eDSXtUyVNkRGHz/MpKTq8wEXv3xGkcWLkOp7bsxP0zFwj8pHmePMWivCLkEkvOKirEk/v3uHJ9NG
                    5gsaMZehJQgtp0gG/nduioLEQnkQgRva2wY/lqro7/CftbwfLT+3c4sGYVCh3syeeqk0ZRgJdQEV
                    Fdu+EcNTpr/FFlVWgtVEdrcUU46LfD2Oo6NJIYZfbs6RMMLMyBh4kJ1k6cyH330ZhobaSIaOGgeo
                    S0akGMJURfciP2fD586DrB1Li+xBw2BJ4ukuJoKyOJ5hTRaEpJQFlaCkokHIWyfPAJSEKBCAI5EY
                    R0vJDApURMo0NhbzO+PNrJKqInuUwbRU0KoZXgSQI0TFyIRDER4klYJ8kpI5xAEs2TRqZADqU8Pu
                    pFiuivpIIEOVliEjXMHVDF5fXdB83FjAlbJtqn5RQgSbsZanr0xd0zZz/82mSsfm5cu4YOmjoY17
                    8WB9avx571qzBr7EjEWlnCiVg6rY81di5bgZ8oqvq77W8Dy0/v3uPg8qUosbdAiI4aAlWU4C9Sgi
                    v1+MrAUI6CWWXkRsejGTVsJxlVLGoYy1UiU/wfJxE9ocgivGNHlAcF4S1VNqtwxiZTqBcmd+oCT0
                    UVOJKvt6ZG6ishCRspHvl3NlFJiahbgG7EIiYUjhvyZaEtUoCOigpatmiBVm3awLhNW7Tv0h29+l
                    jCrJclunXvhW5dzdC1ixl6de8D2x5WcOhqDufOfRDYw4bcnzn8jNojUK0FwoR6iJDVRCS5m3DSPJ
                    F0/WQCX39FJQxRVEYJfU4jgMYqyZG2UkNat45Y2b8/x5CvKf/zaquR3ccC/hp6SGvVGTuGj8E70j
                    WMMT+WnQlZf3cXDKsfyNXV57aVBH6ggio8hcpI6N4T2xcs4sLwv9P+FrCwwi5sGImMdm2RpqOCFK
                    qsSG1NeCuowEZCBB+D1tizaAVXAdPHTUA7HV10Fqng1pWrxEbvsZnEKLtvw+wFRRklLk4UQgpQZW
                    mNQdb2SGWTlZS0SHQqIkSgjgCBGrxklOAmowgXnjKBRwVWxAK9iMV6qqqjh1EL9Olhjtj4VOQUlq
                    Fu6CiMmzYL0+YtwqxFyzGH8jJv6SrMWbwCC1dvwAJKc5auxmLSWWtWbcGaxeuxeNpizJkwG1OHT8
                    Co8noMTe2HgYFJVK72CCadEixQRKK8EvIp4qkmPTSAwFlGzJKmIEeNKgNPkTSClBURpKpM0Z42rE
                    UysCUW9FDRxPySarwmoDBNdo1028lDh7mys3GfxfNmcO8/NwaoTSRyo6jOQoj9fKljBJPwnV03hH
                    Nbf5f9cLAwAEyqHoQg43bwosqIVOBjYWIkNlaWIoN6QC8xIYW17bBp+i/D2TmJ8eihpcG5Gyd9Qw
                    R27Y5zR49x53p06zZiW7WGCzFGMLkGHzEpeItJk06g84jLw1FMAHtyCbYS8rCUVIAF9XQnbWNEmt
                    ujMjEDQ0srMaC0P2YtIN/+g8coWMMsqBuLeSW1GB6ThLze5kjS1EUagTSXXFsKCWY/MTGK0lhEJY
                    ZA0lRxSgoIoPfhKkICNg+J7bvgKUVDrKwHd+5BYWwKrp6/8OEKTfXJ0kdj7/fOXoBkw5YI5gsRLq
                    cAf2kRd9/KXd0QM/oP/tXxP9J+KFhYJldMnYEY077oS9GDnTwfo2IC0Xj3Nh7duIFCD08Yi1GEwV
                    dAWWTSh381/W9YWQHcWjdHkmVf3Kbexb57/vAhxobHUAQihyAJEpfSAtgRWCwpgulE52lBDWFAyZ
                    Ded1fShH83S+QExmJIcQ12btjOnYOlpSs2cWzH3v9o+3gNlvbv2Inh+YWo8A9Eao8eCNDRgqOQh7
                    4UQTlISCBGII9c0jL9lBWQIicFVwJRVMuW3CDhFRK/WX4h2LZuw6/yyd7vXTL703c7psxEpkknBM
                    qrIliN3JtJS2Qat4WvSBVeqvoIbd8Ti0ZP/tU5fpT9MLAwCt09bzFS+tjAS0UbnsqaGJeQiEZS9w
                    9vXMfQzExYaOuhF4myXgrqcDBojrn1gz4VilEr66ksse+e3bmHCUmZCFTWhq+YDLxJj7DZaY4UfX
                    Sg90YU3hrLK8C0uTH8KYwsSc3DxCHjMWfqQhzYd/RXlcXe/17lvXv7GusWjMf6+WNwaN1cbJ8zBm
                    vHD8KBhTMo0vj20JRdgysHpQsnTmFQdi6iLS3hoK0FO54slYF0DLnHWlU1pFP0FCArDksS28Ht28
                    HFqBmi+1rjwtHjH85GkSS55Mm1Az7lf+/SRcjt1hNx6rpIatUGZ/bs5urrxd17mJuUATtZZZjzVR
                    DYpTdWTZvH5eNH2g8BC8vw8SVrUGBqQ/TYBm7SsliQmI6XDx7iwZWbGF3cH30NycWQUF23YC43lm
                    JHUUIE9apFVVUc0D63B5evYEJkAmKU9BAgJYI/RSnuMnz4kZi1pd7ZknppFwNdeLs5I7+wEMNHjM
                    Gli5c5H89uJfxRJT29dgOn587D4QmjsWPEAKxryMPcYl/ML/fDogo/zMt0xIxYS0wPt8TC3DCsGp
                    CNPVMbcHLpLDy5fvXDWX7fWJmY/rpB+RpbUIEylwCEa7VErFADOSS8C0Sy8JeUgCtPDB6kX2wopA
                    9t3Rqndu/mhPyqidMwa8ToX4nWUfHxiNfSQmZLY1w6eOBTORmQXhILT8vIIxdvAjs1I7i36o61s5
                    dw9fGj7IeA5d3rNygzs0K6qiFy1Q2wMDwCr+7dx70L11CfWYE+hh3hR9HG1hUruQpkM8tcNVXgRN
                    GDh7IyRmfnUeVMxApK02sGoMLFAwlK2ogmPRIqIYALhbJWPDnSIwK4NzdBhKMjinNzcPPmDbym6O
                    kNRQ3f0otunT+NvfNmYnlOKuZ5OWC5vx02JbtjZ7k/ttf6YkWpHaandsLKPHPsLnPBpnRrrIrtg5
                    Wx5lSm3pjhZ441Bak4v3IJnl66+OGsv28MNGzg7OHNO5ieXY1BLoHINTRGvIIQoRTuu1HE5EyhvZ
                    24GJyFBCIXFwyKT0JSd3MsH9I01YKBYef0OYg2aIHSHma4duwo10GZPX38CFtXLcftixfwjOq80j
                    8EVrLq6EvJv4MZti9fw9X5j7C/DBZ2h3XN0AZkKSuhH/X6Ki1tHOxfhn9RBtkQ/5xJMxHtHYwtq9
                    ZwvYT1mhkVFXAjoRfVygQVXp5w1tVFQMs28NIx4ELBUBKycQSQeBKyoRKysKVwuy+5NvdO3VCclI
                    Z7d+6gsbFpOPyPjB3z5NJlnN2wFrOTQzDKuh1mOXbAujAr7Mv1w4nBMTg0JhKra52wuNwKM3O6Yk
                    F+d+ys98Cx4ZE43hCNA5X+2JJhixWB3bDc0xTLfa2wKDEEVw/u+XCVPzaWj9eNL/CU3OvM4jIkkq
                    bx0taBo5wIjuSenMWl4SQpRWG/HLxEQtSHhOLN8xfc/04uWY40447IN7XA9RMnPwHlPrn4mn5F8D
                    LribULFnDH3r9+HcGGreAgJY/eVIfJFD2+ePaMO/6v2l8CC2v8/YsXIk9HDZUiHvpLSqKSQsVhDn
                    1weV+TP3354iXu3r7DjRm8efkSSxuGIkhJDbkWFrh14Tye3LmNJCcHOKtpwZVPoSWlaJ48oiWkEU
                    HaJJR0Smirrkj1CEZD/4FUQfe/CSTM2HE3Tp3GzMQkDO3VGWO7G2KulSE2hXTDiTJ/PNyxGHdPbM
                    aKQZ6YWWGF9SP9sW6IF0antsGE9M5YUxuAA6NTcWhoLA7XBGBvqiW2+LbHMjtjDOuojtmx3rhx+i
                    guE2P9mTw9f/IENy9fxtDsQoS0M4WtHLlXEvDO0mxitwx8ySWV9+mJEyuX48q6taggNq3vZY3rxw
                    gonzHoq1cvMWXUKHSnDjprbNOkc1bnQ3wCiK14cJUTUoSkifWzZv+Qm4/fDRY26HZs/UaUdO1CjC
                    KLoXIyqKfIpFaWh3iBDGocbXB5//5Pt9TZkPTmefPhTgK31MEF16kRWcU9uH4NsX17wU2ggAh5DU
                    QJVBEiJaAwWYgIDU2kdTVDQ0IOlkyaiwf3v/25G0b/l06dQrWnN/Jbt0RDGwPMNTfBzoheOF7shv
                    Mj4nF27RTsXDmZNIUlVowMxt7paVg/PAzjs3qgIbodagI7YGqmGy7vIprfOg0nqr2xPaIzltjpYW
                    IPTUx2N8WweG/E+zvj5PFjf1pQPr73gATsMIT3toODlhG5WSEcCCyBcnzE8CWRLsfDKMp7tZ4B7h
                    z+RbQ/uncPd5hGI+Z+QQy7b9t23KFokxkDy7DAQHLxctxdbieeEFHtumDPyrV/edDuu8HCHmOos/
                    dAGrmMwZTGSFGYTGHtCBKjmWKSiCJ6rbJ14vwoM+Z+NpGoHByfjItHmgrOgFLi4QwboRzcxKUQKy
                    LRK1SDN0UMwYbNkefohoXDxuD6mQt4dPfbgcIa7cyJY0hxtkeEoR5KTJphQncTLHftgqOFHjg3Mg
                    r7R8ZhdIo1stybY/7wFDy4ehh3z+zC+hEJuHJ4AxZXBSHLUh+5di1xctcaNN45jzubJ2FfniWW+x
                    hjpl0zjLBtTdFfS/RuroFgT3ecogjozwLmIQHm2P7DGFRUDlsKAiwp2vMVCBAtw0OqlDR1RAGGGb
                    fCKwLDOxKxD69cxfDUDJTaOOHM+k34+TMAsA5yldwUeyjOhiJFZ+pwTpLELvJaSLNwwsGtO0m/fP
                    9Y03eBhbHKvqUrkE3Ku0qkjgkCdYwX42MSCdLRkgooFZNFsqQc/GUUsJuOe/H0KYd4xi6NBB4GlE
                    e3bqLYzoqiG4oESNy5EysFSsnCR6iCgOatMCy3EPs3b8PTh48/XPXbjI2nnDxxAk49u8JJTx0Zzf
                    VR39YIk8wMsSG8B64uG4HLq2qxdIAHKoklqqK7Y/vioXj35iVV9s84OLcMb18+wcaRaRgYaIp0cl
                    v9Y01x/9Z5vH/xGJcX12FjQjfMcjFBUTtFyqsC7Ey0YNO5I+x7W+PEdz7vzJ6AHFJeDVfjNtxtij
                    BKGcQ0OQSYcnlFrHF1x7qgYBSatEQQfQ4QKqCiV18cXUb1+/gxd0PyGrF1eKv2MFNRglfbVphTW4
                    8cdgNXXhfuikbI94rE9YtXPlzxz9ufBgtr9P2r1iKlZTtkKKhioII6RkiICCxCSiJM4mmiSlyITE
                    kRYinu96JU4OyOc4cOcf9lQHlMGqbS3Q12bIKzIkU4UuJwJ8C4UXjsqWuABgLKw7u/vvv6LcZ69f
                    GTJ9C7tym6aCoiuJk2atuboKGlJmZa6mFHuhnePX+Eexe3YkJRT1REtsOYfAesHJtOFb2T65mHFp
                    bj2r4FmFHkginpTujn1Rpp3rq4fvkYd42X969heXxnTHZuhn4dVRBqogxrfSW0I4HfXFEDZu3JzR
                    39tbb4Vnv04CGGE2C8mrXmhvDjiKVTSbeVEksXyQmIaSQQT9FTGKVAnjTcpKQQpKmJUksrDHByRW
                    zL9nAnRh5dXYm182ZzeTi1fRdyeznATVoLAbpdsHPZeq4dvsf+NFguHDyCfEtbRKiqoFBHAwP1dD
                    CYBGuDtDKGSqhgqLQaSsTlkEVgCaNXdykRLBVUEOfkiMO7tuMe0Wmlrx/syJ+6SkvBjcJGVwKLEx
                    XeQ18X9VnZuHPz1if//K3Gjj92+hQ6mZtBW00Eh1b6iDPWQ42JAca218NMa11sSunKgeXmqfVE5e
                    1RGtQGIzPssG/1ZA4oLJ3f0xRVrBtfgPFpzshxNkaWnxFuXj3JXefl/etYldwD09xaoryrJkJbqs
                    BCWwHtFeXRUlkDWgI1mHY2x/Hjp/50GZg9ffQEI4rKEEAuKYDce6K0AHnkToopSsqhOkqTlSI9I4
                    5AGepgMmyylyTspHhwkVdBcJsOWDJ2/IczNXUeloeDK9cjsV1vOEprI7OXB07u2M+V9c/anwILu/
                    DGGXMQqKKKCBUhJnhY4/6MsThVW4XBpmYoEmqgXKCFMllVZFHoFiWtCB8SrKkWNohztIdFC0NY6m
                    jBgj06QRTLHr4K4Muit4QEAju1w6DCHDxvfIYbdx/gHlXan7GL167DLiAQ8pqqaNtCF9aGmvAj0F
                    Qb6WFkaz3MsDbEwWI7ciVP8PjSPszIsUWVdyeMjnfB/MoE3Dy6/cOZmsq5YWo1phWGoTbcCkNSLH
                    D/5nnut1f3b2BVbE+MsjRCQXt1RLSn8NdEB910tdBaQwfGGgZQU9CEk1cQzpAI/R7AsEdhZ9U2cJ
                    PT/aTkkCZQRLq0NOLJVSdIiyGCLwZvnhgcCTj2crLwJjYu8PDE1sWLP5yhqQxr5s35NMayesZseC
                    gbIkinHUoCo3CaXPWftT8FlkOrNyOxdRduimGRiTZOr1rMZYqlf1HUM93LF5mqesiWU0U2VViQjC
                    LiTTqQQD3LhcjVYcHoLiUJF5GIe7jcj3qEK3t8g1hqUF423rxumoj9Mf0Z27prNwR6upDXVkVzXV
                    X00lZBiJ42CnR0MaK1ESb21seeTGu8f940V/bG8X1o8OmF0VGuFO38cj+Gve5dOgozquNQFWKLLP
                    uOJITt8eT2Ze53BpY10X0wyrw50k1U4W2sAfNmmuhIYGlB0ZuBijZ0VHQgr6wJl+BIXLjWFKX8GW
                    N5ePfmLTeh3ZGJfQJLAoXBsRJiSJSTRIQsaTwCixWBxUFDDevnzOH+83kZ+qWnoQOx/isKLJgd2b
                    oVMW27cHflYzqZYsea1dz3f8b+FFjmN4yCD2U+TkSUqMrH6D4dcXPzWu43lkHmCw8MG4bhVraIUd
                    JAhL4xbpw7z/3GRhiTe3ZHXwmiT9IqISJ5eFAEZU8VUegfzE1m+ljYP2s79x1A2559IKuuCmUDTW
                    iqiNBJWZ56nA6StPRR28oEY7vpY2NQN9wfl43H8/pjVaY3auw64+DyhXj59DGmV+dj+eSRXB6q4t
                    2Q59sDJQHWyLbvhOGRFnh84yJ+fnQHV4fnUDTUE4O6GCK+mSrsjdRhrC5CCwKLHukHXRVN6KvrQl
                    lVC4btOmH91l8Y688Yy8fbV69RF50CB2JnJ4oWk9XUEM2XRoScNJykJZDRtzcuHDrwxXpjLsjTwh
                    yhjrZceM2O2bt8BQKU1eFKAjnTyQHnDjZNA/lW+2aw7Fm5EUldLBAoJ09hnTTyBDzUUSWN6tYBGy
                    tKcX83CUTKEGMYFv/PLirG5LQMTqk/u30b41OSKZMC2EmKcQX1EAngR72+yDMAUwaN5O7rfI9dvH
                    oTPuHxkNPUhYg0j4qeJvS01dGRepylqjoSWrRDPxOKrtrpYoNnN1wp8ML1qjDMDzLHINeeWFFXiL
                    0LJ2HHwsmUh6YJWZvGlWHpwFQsGZCJ/oHWmJrqRqHzFQpfL2Jvsgdm23RGZUs9xDTTgkObZtBQlI
                    WiohD6BvrQVFYlwGhAT0cfqtp68A2LxvnL33Y/6bfG8sJWgRgYnwFXNV34iVRI3MoRs5AWpJRPrv
                    3muabZda/puFEUfk+ubXqmidmg/Fz0ovoYUV6Al88bcWHvHuR27AAfYnZfHR0s+/Cw3LfaN4Hlzs
                    VrSHfygxOp/QDKZAq5oWpZYhbSHsNIqQ9gj4Ba2ePEkiWfUM4ecWA9gwmpU9u2IVpXH64kxpxkJO
                    CkIAcnLXXkeHli+pAxVJDvZ5WFy9fAsH1XiLR1oURgUdRQhrqKAporKKCHmgb8m7VDIkUI9a10Ma
                    2rLnYH98KZIj9szPLGpFhXHFgxB+8prz+9f0t5+Beu7F6L969f0nevCETjMCUvCLfOHkHj9TM4Na
                    k/lnqZY4xpW1S2a8U9CNZOXRl6uhqQp1c1LQ3oqqlDnzSdDrlWVVVVNKOocc6CJR9y++eN1QsDQk
                    1sOlyV9RAu0ECkrBLcSPM5k9s9sHULd9yLJ88Q36UvfJt3wLIp05uA9vo1+kWFUzhugBFZKRgSFo
                    QobU0ECAQIUFJGrgO54FNNWuxb7JvAMmfoWDjpGcOB6QwZGSST7qiRksE4KQGm8JUwgqeCStIp1R
                    27YtuMGbh57Min0PHulSuUyXD4ywjgTf+xI6D1VSEtQzQ4bcRIvPhw/+N77OadewiLS4M8uRpFcg
                    EqWmpQVVeCNoGlmZIiOhKIu4nUEGJgjH4kdEe00cF82zbYluyMtflBmJ4dhLVT6vH0QdOzz//618
                    9Y2z8Jtw9uwp1j27FhVClm9gvHniXjsH/OQCxLc8XwPm1QTCF5jnELuGlpoxmFzLqGelDS1YSShg
                    p0CSAmxGp65AaVRHyoEXii4pJw7eZt7hrfY6x+nj99hmK/CPjL68JHUp4iGzn0JnFbFBbK3Tpg9X
                    3xyHH4a7WEv3EHnNy0hfvfuOJCWCmI4KgkhJ8mRUyUxxDKM3tENkC3BaYNbFpu5Fvsd8HCLnbvxi
                    0k2LvCWV0bfkpKCJeVJbBIoZQafgiBZRSFxiOlFFArrYRsWWUkaeujv4cbjm5cj2tHj2BydiYiqd
                    FCJeXgTcmSMunYph2mjBqNZ0//2upHs+YvQ4u23aCgqgl1aiBNdUW0bq4LF4ueCCZfbdexI5rxBX
                    DUMUKCrhHyiXlqujTDMJeuqHLrSXrAg6KOLGxZOAYvHt0lFvwZOxpycWxcEVZVRGNOUQzGZgajOs
                    ICVaGmqPHqgn49jJHaXAchWlpwIrY00dYmkKhBRYfyQGDVU6IQWkUeBop8GJPQtujTA/GJKdi+e/
                    +HXH+/Pbh9B4XO/nBkYJERwpLHg5W8CMNT07j1Zt6TKB7kHkgiVhH9uvXFtllzkNy7F2wIVBYykk
                    g17YzNUydj0+TJCFJi2kUTSY5+uE2u/Fva4Q/BMnFAA1VKM4pgFOBPsX6YHA+R0lJIJbBU8AQYSJ
                    lukGTuSA2lsioob9YKB1avwWxC9AAnWyRQRBIhI4toaXl4SivAVtsI9f0q8ehh0xop32tPnj5HQl
                    o+NHWbQ520iS4xSs/2Jhg6oAJ7tm3GoOJshDjZwVBBHj1JOwQYtEaolgES2zaHP0Vy3u0MURXtj2
                    WjqrBydCmOrJqKx9fO4/i0WhwcX4wJyW6YlheNmWWpSPPqDrcuyvDuqIqwDloIMdbm1lXpra4JI2
                    I0RRVlKKoqQ4fC9ubUg7voKMO+ayuMHzEIq1YsQU3/SsxftARPnz3/kPvvtwXDx8NVwwg2PDnY86
                    RJA4ojSt8Au2fP5lz+jSPHEEEgYBPJA+QUYS8pBUc+H+akM6v9fUioX8eD69cR37oTrNjKEDptSe
                    vU/TWwsD8/ffwU8dau8FTXgY+iAmaXl2JSWgJyOrdGgoYqciiiqaZopp4YY6icCioEylgfGMZFRY
                    dnzkZRWxNEkJiNl+QhnljHR0EXQb3tsW3jjg9X+X6bvWg1WnfqDQ0NXdIJqjDWVMKAfrl4+ughF4
                    IPLkpHqJsNuQMBWpM+stBvAVsSnXZGWuhtpIah5YXYuXw+Nk4aiJ3zR+P+pZO4fWo/to8vwJqGeE
                    zK9cCC6lRc2L8VkwbnwbWPDmw7EwjaKsNcW4A+akroQtGJjrIKNDU0oKwoj3ZGurDv2BIxjn0wIC
                    sSe7euxp6dm5GSEIHw8HDMXbDsQ+6/3+7fvIPi8GiYC4VwYM9g8yQQIhRgfFwcnty8gQcXLyJeQx
                    /hJA98qV3cJGQozJYjZuEhxdoK10kQMy25ZPR4mMqqobeiAcJ7u5IrfvyHgPkqWJgPnDx4PKzlNe
                    BFIja+mS6ePbiPV08e4tTWddg6YzLmZmZgoFFzVJNrqZFTQLmmDhp37uYuemr6LAxs0xJZsjLIJF
                    cQL6Swr1V3jKwcjNu3/vpK1TX1I6GlZwItco/61LN7Guthz9YNXL5vXbmA8qRQBLlYkH6RI7EpRH
                    NVBXTSVYF5Bz001OTjyeMHaHxwG0vqyQ3NGkoRHBvj+RfO7FuFs/tXEuMkYdmQdKrYFzi2fx0KUy
                    0wpDYJIwYVwMG0OdpSBNSWRKw+aRJdDU10NG6OYCdr1CSGYWp5BqYPzEVNbgTCfKxg1qUljJsZoq
                    6+aSmQv2prly+DBwlsR4EURads3EUG8WrKqOxrhhFe7vARiBAoVISXlCw8pGXhQsmVpEC0eR9uQU
                    Zm7NZCH4OW6MpXg7mSEbFL7Sed+TX7XbAURyfBgY22SoshXEMJl48c4R5F/ThU/Pb5c+wbOwZLMz
                    JQ2bolRpNWYUBhd0IXJiajhFxAObmuLFLu8eqkyJNySYz9+UGq39q79+8Rn5YDVWIVbWosLbqGR6
                    8OOHf0AF48e4xR/eKRFeoLXwdbGJD619Wg6EhTCt42LTBn6gA8vHsNb1+/wKWDOzEl3RMz8lxwas
                    0o/PSOoiKW3r/GwrHJmFEZhPs3LmDXmikYWuyIKxcO4i1FSYtnj0Xv1gbQkeXBmEJQ07btkBYWiF
                    ElWZhfm4/Vw4oxpiAcUU5d6Dh1NFMXwoAiperqAR9K8Nfs7t07GFyYB18DLQQIeYiWk0EoMYyvrD
                    gCiUndZKTgQR00WEUT0YbGqA4OwdSa/tixbCnVT9MDfGzt4DgPP3SSEqKPUB2xTj7fBxbW4Czs8u
                    7WlUSQBEKVxOBOlBdrZIzpERm4f+oiN0/lI22xIeWVoxu4CcXsu+Mjh2Fgs2boTzqnQlYeqUIV5H
                    Yzx4kd3z6z7Pds2qIVMO7YmSIfTWIOFU5MRrmZ4dyxnbh9/QLivXvBuYcZPKw8YGzQFop8Sbj1Uc
                    XGBaV4/+4VLh/dhBERvTDQpQOmxPbF4jJHLKt1x96JqdgzMxNb56VhZoMPppV5YkhsHwyLM8XEfC
                    vcvHiQu/67N28wfcwQdCS342ppgbrCQkwfVIlFQ0oxvzoF28b2w+S8YIT2NIJtKw1YdTBBK319xE
                    TH46cfNCf26tlzFB35w4NcUDABJVJI7kieOrUqH0EKQsQZNsfwqASsGjqSm/bKjOvIP//EgYJNhp
                    ozZiwJZEX0Ie1p3bItXrOhjg9t+iX7IljYANnoikHcYxs+KuIIVRZDgCr5P4ECnCQ1EKtvhgnRmb
                    hxtGleyucXYO+nhASjn6IShdMK6CdQQZZhK4yITcOtC99/e/xzqxk+BlrNDaGiStEH6YZWmgpIDb
                    TBgtFZGF7ihRCHdghxdIWfQwBaGrWHqqwUatN7UwU13U44v2cpxkezh9M7YU6mDXZNCMeG0cE4tr
                    AKx1fUYfeKciydEIV5AwJQHdgBQ6I7Yc2QIDy7c/ZTeV+9fIGKgnSMHTQAA/KyEOdmi8GpodgzfR
                    BOzW/A/KIQ1ASZox/lK83PCe4WfdGqeVv0Kx/4oRR/3Y7v2otgciXBFKFG8AkssmIIU+ZjpKcLjk
                    +a8skDfMwzW69mSlkRDm9vWvaVjZqHkPvsKiaGlnw51FfV/e7g6BfB8v7dexS4xZIL0iRRKkviVg
                    x9yRVZCQSwlCaaE6hzy0dEtTTAuAhfHF86j/sfy8CWinpkquiT61FCDl8BSQSW0t7WuHbiJPf7j7
                    D0onKo6utAicSlurwCgUWRwGLLgWVmQzRKEpwQ7e6KCHc/KPN56NtODVOKrPCewHL1wHxsHeWHVX
                    X+GJNqjQFxXTCu3AJ71jQ9nPUxHdkwHMuGxlBYaoUZpS5YPSoCD26cxMvGJ1gxZzjmTR6MwaR9gj
                    wc0MFIG2bN9TAoJRJvXr3EozMHsKAoABNTHTApzw9VCd6I8/dAt45mSE4r/lCKv27XzlxClrkHPM
                    SFiJBiiwGQhlFWwpGpE39V11e3bsNod29uWMNTioe8Pn1w7fBB7lHh/s6OsCawdZIVINozAO9+Zz
                    bdF8HCbmL5GXSHlTiPxJEMXInmg9s0R5GnG+YVl2BBTiEGunsiiUJVHxKPsS2MMCEkAvsqhmBINx
                    vEUKicRNQWIcFHhIoWhkXFU7j217XKR/MMDYeQjZiqa0CPUjMVCuutumBybSJWTcnHyJJwxLrbEM
                    NYQ1tODL7meqRRXuLajimYW2iGh9dPc73uwa0LmDMiBuPqvTFtZBjWzK7Cxjl1WDImH6vGZ1Jlvs
                    CFfauxgsTug5tncf/2FcwdW47BZYmID3WCde92MNCUh7G2KizbGCPb2xmvXjzHw9P7sLDQF5NSbC
                    mq8kJxmD38bfrArHNvuLmHfSjFXzcGiLP7DiNY1YQ0ixq3coQXdegxcdFYPWIECe0KFLv7IF7XBG
                    kiLZQq6yOTJEESBQWjAgKxpF8x4lsao7e4OBw0dGDfqjNmT1/IPa/0JfsPsDBWWTh+Gix4CrAhN2
                    QvJcHNaGNLiLMn9bmH1imx92zm241z5xCqa4hYZR1UabREiUgHmbJ8hEpIwJH+n9itJy4ePf4rpP
                    9Vs3R1g4BCVw2KvvSpkHpsHZd2zVCd5oczB9fh6cN7qEuPQHddEbroiaMuxRqX147EweHhmJHSA2
                    tGZuH547tcnh7eu4q5U/IwZ3IBpo3Ix8JxlQSUyqaZc/Q7G9U9vH0Zlk4mTTKpEv2zA5Ab74HYIE
                    cYaclDV1UePdu3hk/fHoi06o4Xjc9w58QujEuwQ66tEZKtWsC/ZwvKnzFM23dGRwr3t+1pejT3R9
                    jdazeQaekKR0khtyZNMEkFXxU1BOgZwVFZDX6KOkhWMEShwAD9ZLSRLaGKZGk1ZGi1RFEHU8QYNU
                    MfckO2coroKdJARWYJ6dUvP1j3H2BhS3GVRqfASV4e7kThmabd8eRuU8V+yVgPvXX+AtJ0TFAp0k
                    OJuIDcjwwCJMVhTf+vCI/C4x+8qZO5kyvkNdWgpqkNLVUt6CqqoFer5iiI8aSIqOmG5oPbN2DfVh
                    V27XlYMTwKe0dEYGWeDSbH98LkbA/sWDyei5xePn+KRbNrsWn9TGroJ1g6exTHQuwc965cxIldmz
                    F3VAUB0QM5ERaozPDGrNFlGFCUQlGOArRFcmhOwPXu0wVDsyKxbcEELGvIQ5lXV4R10YB7WzXYt9
                    Gj/DVDC20dGJJ+Gzl5/g8DyxMKgfvHJsOGL0IINXi0QAlekrIUkAhhJylHbaiCQAJHpnILlOt1RF
                    2rXpho6YUDo6fhFUVEj27eRKWNDVxINtjL6yDXP5b02C9Lg3xu/wEWdq8mwsoR9hSOhmprcxsTsI
                    LdvHQZa+bO5dZ03Th5Eg7OmYvnN5ruqfzElHV4DMoE2qiWVkSGhBT8JSXh19wEx/fs/e5pfF8zMz
                    sHbpKTCoFFW1Oferc2LDp1Rl50AFbOGIFnD5pm2t24ch5Z/q0wqcQOO0aGYG2VO4aFdUZteG/MGp
                    iO+7ea7qncvX0Z+3cu494vmjsMl88cxNnDu7B04iDU50aiX4wDCiL6oo5AdmDbEty8eh758cHQ4k
                    vDQMhHoK05bly9TOB7gq3zx6E23gWRFq1g21wF3bUV0ElbDe30dKBNor9585YYMGzSDwMLWxnq1L
                    4DiGrbERGkD6Mkyf1LyZOO4cFGWhb+zYyR0tMcI6PicGbLNjy/ex+vHj7CTx/Yg3mJMUGBxEw8OP
                    PUEdndjjrNl0ea/wMsLP52aNEWzmxloeYtPhVqfN1gOBC1easoI05ZESXaeliVmoVG0iJsrZVdtQ
                    NQIq+JSkkF5EjJEZrlkGXvjsf3H3D//5HWx8kJCrrqUNTQJFdEYFE3gI2pOdJCAzG4IAmn92/ljm
                    Ost3BIGKpjW2HVEC+sHuSLASEdUERR0NT+iaRZmiY0vSWXs2nZWFy6cBgTxxVixrB8DMkLR3mKF7
                    LDLFGZYItRRV6YOzwFh7bMx9E9G1EU5wv3nh0ISMG4fe0qV0+P7twggA1ERoA1+rbWRksVAZqTnj
                    JSVYEeuQZdNQ2YmLT9oWBh9pQav9wrEMHEInHSCoiRlIcPAaWYGOPU3j24c+0a9/A9Awazn9+/w3
                    2KjM7s2oFNc2cjoU0bOInJwFNaA36GnXFo0y469j87+K/Awh4T2L52I3opacJNXoTQZs0/Fao8KR
                    Nm5BN9SEClKYqQLxChTt8Yp2bP5cCycUAFSuh/lcQsOaR34jUNMTS1gLtb+qPNkiIdoY4qiVwNqB
                    JYtDWM0LNjT3hZ2yLB1xV7NqxsarybF7FvfiEaMrtjXr0b5tZ5oiSoPVKdW6N/kjv2rF9I0csLLs
                    0emoXp43IwuCoMxdH2KIt2wLDiINTneWB4vjMmlXthzpBEzByei5EVCZg9ogKXzhwngPxyE27t7P
                    HICXOHj40Z2hhoQk1BAB11dehr6ZC71IQmuUx9g1YorBz2Q8HCxrkOrd+CGJ02CJNSRDC5n0AlJV
                    w9cvhT+PyeorSnV6/g9onjODh7Jia4OCK/fSt4airDlY51FyMWktGggMUEDUlFxJL/yS6/Agvbai
                    XRLQCmFMk4y8kgxFD/U6GmDhgCZzV9+JKYTFZTRDaFaANatsOJOfMps++woiQXZUrqqOYpIpGYJa
                    9zTxzauI0D4I82c1cX8KmQSjo6UKNwUEPDACbUCO0MmsOsdQuMIeDeu34ZO2bVYdOkDMyt98OCkc
                    GYVOOFvMDOCOljgCiHjhiYE4r9GxbjyomDGE8R1MACL/RLskaGZxcMSycmqY/H2BJvDM20wJD0vh
                    iW70XMFYZpw0px4/wxvHpyD28aH3J19OzBPdI1sbBo3xKWPXqgVatWUNJQh7KWNtS0dCmP+lBW1C
                    ImNEZ0Sgm5vB8HFmZsNcx8Mxd4SyjCmycHL2URzh3ej3vXrnBPfm4aMQwTqZMN7tQRZWqqyCddma
                    4sj3IXW2yZNw/hyrrwlVKBl1AP2fZ+ePrgP2/0/goszGWEmVmjJ4XL7kIpBFPvfXrvHlcZdy9exe
                    jUHKSb9UBGt3YoNeuORdm5eEDi9qd3bzEvPhL9FVTQnydCJE+GKNCeK8DfYb2cHSEgHaBuYEDMog
                    MNdV3oqJImkFeCEVWAbUcT1CSHYPnIYhK3Kbh4aBUunVhPUV4OymLsEWrRBnGuvTCY9MiksmQMTw
                    tCbawj0rzbozrBEiOS3TE5JxBDku3RL7gj+kd2wuDk3iiPNkd+mA1WzRqJp3evYs/UQhyaXYHnj+
                    5hYJIf+hoxbaIFc7M+aNu5G5QNmkGgqQs5YhVldT1oqBlCU8MYYfEFPxwsrxpfoMo5DL6kO/yEFM
                    lKicFNVxmxXVshTEcD4bJCpPPlUSqnhP4CefQjvVVsoI1dE5uWoq/oYwc/WXV4C3QR08USj0nb/N
                    Z+BZYHd+7Cy7g9LKSl4CMvgQBlPvq7++LF46ZJzo+v38SRDeuxY/kiHFy9HE9v3+a+Z+vYVnVsj3
                    o5BTQoKCOKITbQj1tM+O8wKzc3KGhrQIF6iDrpFm11TWgpq8CQPrfUUEZzBRk4ttfHlMoUXNq/hs
                    sjmwm3Y8VEYodIanQ/NGTHYUxJKgYk+CPHrTfiLUxQ5NcZKxsSMbcgAgODrNHPszMyHAyR5aSH/h
                    Fdke3VjoBmhJp4R6wZno6d5LY2D0vB6EQHOBsL0UoojjakpXp07w5jCpOVDEwg0mlG7tKAxLgh1O
                    lVVd0IoXH5Pxwsb56/xNDgVPiJtBFAYHAQF0NfCTFYSYnDl/RLilAdOTIqyJcQoYSiphySEhnGut
                    g+tWlHlCnRSfAndvGmICW4RRc8vH33w5l/sV+D5fYdeOq1gKW4OPzkpBCkJIQ79dhRMWloJBH1+f
                    0g9srm2z4nwEz1cEMGXxajhCqokJJFpKYGhZHZn1bE/tFm5ewKNR1tKKkocXNIdNWVYailgmYa8j
                    BUkIV917aYUNuPBNxaihbYYoakxRYOxfS6BNIeKZhakYtxhckoDXdBupsZ8jx6IdetI+ZWBWHNsH
                    jMLAjG6Hg3lHh0REIvNSSZq6AqoB0d1xJRfbVQFd4Lc8tDsaYhHSdXTcbuOSMQa90GbalzNVcTwt
                    iQWE5PjyI2HYiIUZTITWpqN4OykgYUVfUILHk/HCxs4tPyIRMQpmsCX1k5+PDZ+r1icBSQcJWVR4
                    AsBSYK2shVa44sHSOkdmyN6jB/rJnetErUkvIqOIpU4cpTgY+WCa6dvfCprT/aJ7CwH25dugI3FV
                    3YU9gVQHG6NyUzcVl0phTbqTumpKTi8a1bXIj5/OpV7M/JwQwLC5QoiFAhw8MYgSqKxEXIbNMVK8
                    bMwN+1AnQPc2vy/VrQ01KHnpoImgo8tNZXgn2PFkgKtMLOdU3jGD//9B5rR+VhSX0iFg+Kx+zaWE
                    wtjUNdrDcSrDogunczDIx3xeLh+Zg5IBpji6yxYUIclg1NwqpRBZhfHoKxCRYYGtoFc/NcsKomGB
                    MybFAR2AkjEpxwdOkvy3Gd3r6MQnd3ckPKUJWTgIaiHDSJ6TTVdaCv2xyG+s0JLCrQNTRBROKPd0
                    PM3r5+jYRuPeFJHddPjoc+xC4WAllEdDFFlX8kFhbVYvPg8Vg3agwuHP1lZj8rw5ElS+BFeXSQVo
                    K3WjOMSC3Es988OvwJLPdv3kaWgyfsZRThTg0eQELVXkwaFuT/egpFMJWSgQUhlm0A5aAkQrSGBj
                    IVlJArJYXBCvIYLMPHUCkRqhV0Ud7b+dOdzr/DLCwcoCxShKKMBJprCOBu0RaJQZaoyvLHvDEFWD
                    ahCBMrwjG/NhG7plVgFTEAA8vU0jBkOHeDXxtdhLbVRr5Nexzb1BQ5MTe1Zkoc5o8OxtZFVdSYP+
                    P05jmYkGiPBq/OmBVng03VwVhb449aEsmeLYSoCrHBoWVNk6M/pvnTRsC6sxaM1aSgJRCDppAHdZ
                    EQQtKBfOpQ7ajT5ZcPwb/o2B9tbAeUNEt7uPFk4cvnow+5oSExEdxSsJ/nkaXfGvsu0twCTtThHW
                    XVENyxN24QeXxun8By68o1xJnSwTIKcBSXgitdzF7AQ3TPTqgJ90dUl45wUtNAdGdTDPYPxVS/cI
                    zo0IubqD1EQFqFMjiYL0KurAIq7Fy42/h/lznZeMBQXRstVBXg0bcDGkoiMb4uHjU5bqhMs8PALN
                    IUs2o5ZjkydwBGp3ugPNQc6c5dSJPpIK5TBwxl68u6WWNCQhDunDrMgWX++DiMGxbJAYVV3pa54z
                    Ak2AGjPW0wmSX/XpgY1QMNoZ0R2kUdXZVlEW7XBVOGVGLLkpmcu2P/O7JjDfpF2iLSrg1C7DrCy6
                    orendqC2tzS6RlFWPCzFVfbLC/amzaQblfDNz5CvBiC0BS6D4hN5NbweJze934jFznVKybOR5LZ0
                    778C1QEhEOe3JFvcizRJta4s7V6x9+abJPYLl27gJ8m7WBM4HFVkwS1hQ65zia4w1diMXxW8ePR7
                    Rxa5zeu5/7zMZWHpw6g4kde6BGRg5DiPoGygqQI6+IWaRX/s4Vny1626Nvt+6I9LSn8DcMy8YVYO
                    XYDAp/PTG6wJmioHhsnVWKLfOHYEy2P5Js2yPJrgMKPftidFwYpsfHYWF8DGaF+WJaYggu72Mh/j
                    vMm5yLmVOLPjXkjoXTMCE+EDPC/bA6MQIrUv0wJcEKY+MplI6xQYZ7T2QGOCDB3wW58aEYO6gaK6
                    aOxobJAykKy8Oy4Tm4eGQH7t++gUlDCLTDR2H+ojXcKgt/B1jYfb0J+TXwUdKGF08Ac2lJuFLEk+
                    vvh7qkNIxOzsHo8EQUmVshQE8DrobaKIoK//BvIC84EFbU8S2khXDTb4kx5bXcs9cfjQPL86eNmF
                    RVz+1+zra+ZSsoxlqZcStBs0JdO3QQI3wCEKOsjXHhcTi+YAnePHrMDfjcOXoM5fLyGCQSoU6OwK
                    KigrklpQSWH7OO2ZestLwaCTGhGF2XhzlDs7B1ch6OzMjDmtpATM22xZxKP0yvDsfgbD+kelnCsp
                    kahb8eWFiejlUVmVhdlIxFqaGYHOWBmTnRuHxwJ94TWKaNrMSk4ZWfGvLoyvnc8RvLMrBrQC621W
                    dgVW0c1gxOxalVs/D65XNKL/DyxXNufsuyBTMxqjQbg5NCMSo7ErMHZGPHgkm4e/Ui1+sbG59j+d
                    pf75P4I42NaU2rGwUvaicfakdbCXHY8iRgS/rFheREsLw6ouXUEE1hdJiIDy95OUQSy17a07SRV6
                    6/L6yUFNCXdE5PkhZJnt64fvkXV8SB5f6NOygLjoe1UJnbAcNCyEe/mCDuBNfPnEaZrx8iVLQRKi
                    lEhEAZqSZtsLx+ELfL6JunTzHZzBQlMjKoU1BEkY4eZpOy/vhA9t9hzwnET+naO9bNwepJxbh38R
                    Aen96CHYOCMCvTCjML3TE8xxslsW7wNu+GngaaGJ2bhLVDyvDg0lmcWr0Qy4rjsbQ8GSuH9MOFw7
                    u5/M4ZP4YYoP4TWE6umYu1tWnYOiQXd0/ux9vnTylEfYq3L57hp7dN00vPHTyIy2ebVrFimoFNW9
                    y2aA7KwrywY+VibisYxlrM2DGv/0b3zM7Plirx1tCDL4HFXVoCjlIUEdGrC7UPm5MbIMlHiLQ0ws
                    hzMBHMNgJN7m2OuSNGwt5AH+YkzHsKpdBJThIJbs7c1sYfjQPLAwJLOYHFhoGFtIqNigKGluZwF5
                    85uB5OBoYkmuQRSClIpMRdIN/JHtdOHMM76lWrg/xRwOOhQiiPYlLUywYN/1vB8tFYz37+5C4XHj
                    +/fQ7bh4RhUbErpuW6oyHZDVm+1jDV0+Tmmly/cA6ND+5xeuTd65dovHcLzx/cxfNHDz7dZX76+D
                    EeP2wakX1y5wr2LajDnXMHcX77IlzYuwp3L53E3cuncO/6eTx73LQo0dMHD9BIwGXvP9rbVy+xdt
                    ZUzB0+GE8eNA1uMddz7NgJXCRt+HcaG94I0DeGL7khTzlpWLHVvRVF8NPRRoi+EcIphenpIozcU4
                    i+FgIIII6kRZ2ok/cQyMFMKI2eIgl0V5BBsrvr18FiK1LhdtWwVVXEiIpCrgJuXrmMUEKeHdGYO0
                    UgLooUJWkoY2pdf7yiXvO2sRFznBxRTC6oUqSMAt0WWDF0HEeJ/4S9fdmIp3ev4NTWWVhMkcpc0i
                    0TstxQH+eCJKdeaEks6dS9858G7/NHdwgwFwhcP+Ha6d1YMDwdhzYtwKPbV/H43g1uOsPv2bnDB1
                    AR7IPFo0fh2vnz2LZxM6KiEjFjwcoPR/w9xsAS2rw9fCjYcJKRgp+eDgnZGTi9bx/OHjjIMeHZAw
                    co7ceZA+y7/TixZw9O0u/JVlbcTrZmbK9sFQFSCSzXL176cOaPbug6uaGgOGIWAguPDyuhHIojfp
                    nRNaGyGnHmfZDQuwcizLog2dECZw42PWH3inrjYGKTShJFg0hY5WkbY/7AMf8IWNgUxhPbl2Pl+H
                    xMrQnBSBK3YwvdMCLTHVkkPr27mcBIKAPnPqbcQ+9/1t68fEy0fgk71kzAzjXT/xAgH+3t61fYsW
                    Q+RsRHYVBkFHK9Se95BKCKBOPNOz/+LvznxsASYdwJPuQF7KSkkd2nF7fl3rfYsOQUWJD27M2XJH
                    ckQKa7B4XPv2GW+9dvozQgBtakR5jAtZCUQlCnLtykJcYu965excndO3F81zYc3b0V54/s53zxv3
                    76GVe27UQdTwWDxUjkyqqjWK8NFgye9I+A5ciOzVg0uhqTByZjSKk/anOcUZlsjcLgPgjoboReek
                    rQkBGHt7P1705E/pK9f/0COxaXY3BeD2xdOQpvXjfdumBzc14Tm37cEIrVz6sPy4WwxQBYvRzcsB
                    LTi7KwrF8/zM0sQJlHCOpSirB13V9/uO6PjANLMwKLjBJc+ELEtGuPU3v34cn9h3hM6QFpmnu371
                    CEdofe36XX23jwIRW4e8JOxB6LlUJfoSyy3Txx+7OxFg4s967fQrFfFCz55GKk+bAUl4KFrAICW3
                    VGI0U9bI+fz30yqzC2n+HlXbsxUK8lhvNUMURMgDpJJVS36IrlQ2f8I2DZvGIZ6nMSUZsZjKpkd5
                    RG2SLToyuierdAtmMvjgU7qqsjJz6Sq8TfM1Y+5qq4VxKvBxYMxNg8O4wocMStyycJHG84gNy/eB
                    Er+w8g8buWm/TF1vZdOHEMid4X2DdrNpbXVlHEVImN1VXYWVWL3VXDsKl6DFYMmY4ta/4ZsEQbdE
                    KAFGlLGSF1fB6ctI0Q1KUP/Dr3hX3zzuhF7N9T2xAWhkYw01BDXzV1mCurwk5ZndvWxp7PI0kiRL
                    azO27+1g3du3YLBT4RMGfURWCxIrD0kZRDLwJApH57jPAOIf99l6ssli7v2YGxXi4o0jNCKU+RwK
                    KAgeLSGMLXwECTHlhcPf4fAcvGZSuQ5u2JQn83FHvZIs/WFEODXDE7JRrT4yKxbVA9BkZEoSY+nh
                    vFZBX5S3rPuSbuORrGFs+f4+CiZdwDcmv6F2BubijqQy2xcEAK1k6owbb5UwkMs7C9ajDW51djV8
                    1w7Bw+FvP712Jp7UDs7D8Qy+PSsS4zFwf71+Fc/QgcKx2MzZk1WJZdj/nVE3Bwe9NOrH+nsbIl6H
                    ZEuJQKsYs8nGTlYSotQE9FErNmNsgLT0BZUgaSfPxhbWKCvvo66EShchtxCSIIedhKycBeSgqOFD
                    rnElhuXPhl2XkOLHev3US+Vzj60MntyA3ZSEijr6Qs+orJwltKFX7SbH9APoJUKD5XF1FEJI1Inj
                    Ty5BRQK1DBSBkFjCba6y8uQpluO6wZOPUfAcuJA8dQl5yFmTlF2FU7CDuLS7E7txC7sguwKCwGq9
                    JycGrMZGyubcCG2sGYkZ2H2aWFWDKoEuOL0jEqNwWrhg7CluGjsaJfFfb0H4y1qVlosOiDYbbmaH
                    A0x5zkCCwtzcPDq1fw7OI1bM+qwtqofKyJLcCqpCKszq/EofqRWB+RhnW+0TiaVoxLZYNwJq8WO2
                    KKMds/A8NDczGz/yScPPjta6F8rzGwpBJYIiVV4M8TwYEvB2slNZSHRuEhuZ6Pxlzm2plTMTAzDd
                    aG+ugpkCfNSmxEr2xZeEeBEAWunrh18Tea5e7Vm8j1COXAwraQs5fhwVqGD2sxGYTLqiFeTh1hJJ
                    aCKAwLoxRHsXs2hcpVFEYPogiIscpACRkMJM3TT781VtRP+EfAwuzE1j2YEJqBdVF5uFs1Bs8HTM
                    CRyBwssvPHjugcHMiuwrny4bhUMgwbgpKxLDACu/OysYs0xerUWCyMCMUczwCs8YvDaqcwTG5ngS
                    E6rbHO0RMrXDwwn3rXPgLfuZqhOF44ENsjCrDANgJzbEKxJ7Yf9qSU4FhGBTa4hGOdtT/uEUjuFz
                    bgWnod9kWWYpJPGoXxFTi0q2lp1L/bPoIlXEKEQDkRvFSofUKDuR32v2SMVZcPHwobdS30JJJwZR
                    OnZOXgIq/wFbAQs+R6haH3B7DYEQ2xHUutxcQJJPKIJ1cTJS2DaGkxxBNYUsQILGISKCKQVErxMV
                    gowFAFRVTQf/Mpxmeu6nON83falSPnMCOhEjOck3AoqgKP+43DxdT+WO5CjOARgb3U+89k1WCfdz
                    p2u8bjUHAyjiQmY1d8ODZF+WKxhx2m9DDFGgcvrO7jieVdnDDLxBSHfcJwMDgEK50csCM0AiczCn
                    E2swpHooqx1iEGq20icDa+HHfzB+NCXD9ssvDDEfc43Euqxv3MQTgVVYZ1fnmYRZ+nD52JQ4fPfc
                    jx32sMLGnGXaljC+BG7F9q1xeND5t2Srt54QJGF+RiYGocpvYvpqClacEfBphZBaVwV9GGnbgk3K
                    Sl4UbtmUed5caF32iWBzfvoiw4AZZCVW6XCmtxMaIvKdgRKIKl5BBFaAuVkUCYDLGKpBjSKeVKSC
                    KfwNKPGKdKTgY1Igq3ZfkIFypg3ZwFlOkfO6P/a8a2u7158ByWJNVhvk82rizZjH8Tq7179hxXhk
                    7AmQFDcSKvBifDi7DNKgJHgzJwIasIB1JisTXeG2vD7DHPoTu2+nvhWEQK9vrHYlKHrlhmZ4nLxQ
                    k4kRWCtQHO2BQUhKMJOTgWmY89Hkk45pOBu8lVuJtahUOe8djW1w9Xg/NwI6oUF2IrsNkvF3ODC3
                    B260FuQO6PHjr/Ecaus3HZevjrm3BLx9oJJDCvIJkLRm6cOYUBVAY/TW34KykhRE0JGb27Y/PCj9
                    M5fkJ2XztyQdLwlhXAXUEZucQsbL+kj8aBhQ33F/nHoBcxiwNfABeeDJz4EvRHtuE1H2Fs82tilA
                    ACUQxjFRkpVCqrYFy7TlhmY4OxbYyRKyOJCmVFxJOyHlPe/6tPtf0dxh6HuLzvFJYXjMQtemXG9Z
                    i37/Dz6zc4WT0YR0OysYPAcsA7BeczinG+XzZOlkZja7Ij5np0wr4kf1zIz8VWYpFZDn0xw6kLTp
                    cG4nL/MKwLtsRyV3vsDY7GIb8k7HeOwbWgXNyJLMQp7yTstA7EYedoXKTvTgXmY6c/uUF6PyurHt
                    dP/5jnu7/F2PDAlLFT4ailBxvqxJ76Snh0+wZXF/tXrURCy9aIEKkiia+EFBKz8do6GJAc/+HfQJ
                    1vKHzZSL1QEQ5EGsn2zv85KPfozn3UxmXDXlkbTnSQu1AOznIScOYRQPgyRGkS3MaQgZQYWHJI0w
                    ylCx8bNwFvyRfePX4UJVrKqFBSQIa6NkZkFuCv7kDxZ431jGunLmHX0s24fPw0Lhw4hOsHD+PB0a
                    PYm1+K/T4J2GcfgT2uMTgWk4YzBWk4XR6F7en2WBLUBefGVuDtvbs4U56FeYEkbi01cKTcEbeHhW
                    FbhAVW2PfGdlcv7LD1xbZenjjrHIXTzpHYZxtEYPHHUddY7HWKxWanBCx0T8Gs5Gqc2XPsH9NuzF
                    gHbagbCmsNbfQmCWGtwuMGLpkdXLUK6cbtSFKoIUtSCYUyysjQ0Ef/uGjud2aVrr7cei5elJzkFZ
                    Ht5Ysbv72RyCr6wPotCG/ThdMsLuSCPISSFKeLUSQkyQElQEIcIZLiiCV2yaDwqq5Fa2yvrsHDY0
                    dxbuVS9NNVRSlfllArQrVfJHeX9Z825voanzTi5vlLmJBdiAkxCdiSX4xdcWnY7xGOrb1dsdrMEd
                    t8ArA/ORR7s7ywLt4cC4M64MzMgeTSfsatcQVYnmSOIY6K2JbTDWcrnXAwzhob7c2w3swcG7tYYU
                    N7S+wydcSO7g7Ya+GJrb3csdHMCyt6+WK2eRCmeKVhdsUY3L/9Y5/E/CNjD7VnJ2bBVlUbVhJSMC
                    c3tHcl2/ruPTc0sHXMJAzoaI5K7TYoUTZEWbtuWDV2FMc8N46fRGKbbvDjy1PILYfoVm2wiwD2ea
                    fnwMLs3rXryDK340ZwXcjlBBFgAgkcgZKS8CaweEuLI4B0SwSBJo1Olq+mh8r2XTHc0gqDunZAnl
                    AWtdJCZEuKkNfH9W+d/PRHxpbBmplahJHWnlhi74sdzgQOO09s7G6OxZ27YaObA46lh+BEURDWxZ
                    ljlncrHBmaite3zuHNrfPYXuWESYHq2JlvigvlzriQ7Iq9dubY0KYzNrToik0te2Jd+15Y3aYn9h
                    BgNra3xsI2VljcxxczHaMwK7ECJ3ceocb751wxs7dv3iKBolp3eR24S8rCmtow2cIUZ/fv4Qjh7f
                    MXuHPyDG4cPIorew/g+tFjePm4aXmwAf6h8FPSQahAlcAiQJ55X26H+s+nxn4Cy5M79zDALwLO5K
                    9cCBwRUpIUAUmTsJWFG4lZewKOo5Q4/CgGT1FQR4FRG1R0641ZCSnYNmYMhrPdKGRUUSmpivR25m
                    D7Av63jKn7a9v3Y451COa2tcW6jrbYYWqFdZ26YmmX9ljn0BtH4r1wriAEW+NsMc+nHY5X+eHW3E
                    K8fXwVJyf4Y0KgCtYm0PdpNjjiQ0zSowe2tOiEjfodsb5FN6xoZ4plrbpjW1tLbO3ogBVmFEl5JW
                    B5SiVOb9zDTaD+p41NkYjp6wIPaocgaTbAJkkhsSKKQ3xx5uABboT6t8aAcuX0afjot4C/ghaCZJ
                    t29q/x9sXBjZvw5rNO/wksbM7sxunz4abdjJspx9b6iFOUh5ecAmxIx9goKsPHwBApJGpnZeVj/7
                    xFuLhlO97ce4CfyeXsCY/BaGkV9BdTREqzDrhJKvqfiAC+Zj9Tr15BofSsPqGY3c4RS9qYYXGr9l
                    jSuT0WmrbHCvNO2ObWBxs9zbDEoz1OVHrj2rQoXJgZihPT/DA+VAsTbFSwuG9zrOrUDhtad8O21r
                    2wuVVPrGndA8va9cKiVvS5kzN220dhdXAmVuUPxOrhM4nym3TCP21stS7f1h3hQVLAX0YIJ5EATt
                    rqcGlmhBwXVxxYu47bLOz1kyd48+wpGh88wNXTp+Bn3JzIgIdgEr8+PCFCdA0xLDkTTx/8ekOwT2
                    Bhdv/2XdgbdYSZuAx85aQQSaLVTUcPwV3NMLJfBdbNmIOjq9bh9W8eSf0X+bUjuQUYJiWPgRKkon
                    UM0JCT+7c9CvItxoB6ZddZHJ23GdO8MzDT1BmLu/bFcjMLLOhiigUt22JV2zZY0b01Flq3xJ4cB5
                    yfFIn94/2wdbgbVuSZY55TGyzq0habu1lhTw937Ovrg/0Ofthp54v15p6Y194eayzCsDmsH2Zn1W
                    LpxIXYtf0g3v5NTzX8njGGuHP9Ghw11BGspgp3WVmML8zH3IZBKKYQOMakA+KM2qJf516YTJptZm
                    gQik27wkdZGQ7kLcLYDi2kRd1k5eDdzASzR07k9rf83H4NFnJF1kSxpuJ8eMlKwFMgiYGhIdi/Yh
                    Xn85ixRuBuuH1gDZbJF/fvY1wPM4yQFmGkQBnhPGn0Dw/ltuT9bxvL37l1B7Alr54YJBrL3cOxzj
                    0Ma8ycsL5zX+ywtsZWL2vsTnHFmWGx2DU4CDsGh2FjgQ+2BLthl4Mn9pM7u+idjWtRJTifWIwL2V
                    U4lFyGGXbhGEVgWZRajy3z12PblgMUkfxz0c/nxuq6IiqMYxNvWT7iDfQ/tdm9U2exY9xULC6twf
                    i4ZJRb2iBCWZHErDT85IQIEogQRNo0mMeDo1AAt9btCQt/8JAZ26/Pp4c9esuIECxgGztKYvuQem
                    5EloGEpSObNmFcQT5uXGh6COkFUdnwPhYoIl0zjlzWGEUlJFImssx7cbPI2DH/C3Zm80HsHDofi9
                    PrMN0/HTMtArDaMgBnotJxu7SCQmYCQUU2tmWGYlVqMNbGheJ4UgbOhmfjoGsKrsXW4UnpRFzqNx
                    JHKkZjZ/1EzCsainGZddg665ctaP5b9uJZIzLtHODOE8CfPEMAuSI22Z61GevYn+fvxaNHmJWRhj
                    yzHvBVIo0qJQUnFsQQyKwJLL6mvQgLf/D4auPTRuSEpaK3nDL5PHHEK/GR2a0LCmwdkGdpCx9dI3
                    gZGeHC8Q9bwJHfm5Keigx5FdQpqCKPLlilyEe6SBZhOlpoKK7A86+s9fHfsPMHLmLVqMWo8kpCgr
                    4pRpm64nRmOV5u28O50tvlVdgaFonNcQk4lFuEszlVOBJTiG2+6TgUU45LJeNwvHIiNpSPwZqRs7
                    FiyjKsITf3v9AhGh8/QaBxO/jyFRCvqAU/Nj1BVgj3Nu1Qm5rB/f7bfP5E4nVGXCx8FOThSG3nKp
                    CFlboaMoPD8ZR0zW/tV2BhJ3t49z56yqnQxSQQLy8LV/JjfSkqsmNr7quo49LJpoUEG8n1jE9OQY
                    SePnIM9TGsRycMNGuFZE2iQNI7YUoqGBCbjsYnP37Jje81lm+W9q7fitjuVshs1x1TvQOxJSMbJ8
                    r742J6Ida7BmJrZDK2J2VjorUbRvSyx9KgGGzPKMHO4npsqxqHjYNnYO3EpVg+bSXWLN3xH43wTx
                    vTFiPKB8BWXgO+8mpwIxlhJyaDbhSo9BAoobeKLiIsHTF5QD0e3/tl70mWb7YIYYKJCeykJGBB8q
                    Gvtjaq8/t9sZP/CizMGp88RR91Q7jI8OAlIQ5XCT5spQVET4pciPWxYu5dvoKJUbE4PHdu01pzlN
                    ju8WM9rZGjqIBoGXkUkhBkM7T+l+zGxSvcjLHLBw9jZFAoKvqYY6KbO9YFhONEUCIOe0Zji2805j
                    h6o7xNJ5R16oJZQYHYmJuHNQUVWF7SgDWDpmI1McuyMfOwbPpK7Nqy/78KmCcPHyPPJxw2sqrwVd
                    SAt5omYjt2QpG7F8ZmFeDBrdvc4BrTMJ/nkz37tWbIIPiqqqIXMYsZiVublm1QW1GLF1/Qm/8BFr
                    ZElHcPK/SS4sFZVgBzMSkSvDwkmlsQkH6hJjaWwWbQfRRRLBONW7dgnFlPlPKVkCWpgqQWPbBo5A
                    xuP6EfbY9PXcK1bYdxbfsxXFx/EGeX78KpRVtxfN56HJqzGvvmUlqwAvsWLefS7nlLcXTpWmwaMg
                    5bR03EtkFDsCwllQPCLE8PrHbyxFFbf5yy9sdOinjWuHhjkZcPFgYFYHl0GNalJ2NdfiFWlgzA6q
                    rhWFczCuvrx2PN8CmYP3gc9qxcj8MbtuP4pl04uWEnTq3bjrOrt+Lsqo04vXQ1TtH1ry1YiWtL1+
                    P85h8LLvbocYhJdzhJK1PYa4SZxfncvFumWdjg6MdrNZJWObB6HTZMm4n5gxowNCEB4fr6sCXNYi
                    Ymjj6Kqgi0dsStG1/eJeQ/wMLC3aywJHSWEsCKL0+gkYOvcVuOVZhY+q0xVjmxejU2jxmLiRY2KF
                    PWQillOkdCldS2Nsr8EvDgBwx7M5F2aft+XFmzGbeoIXYXD8ZOEpvHhyzA49PX8ObZC7x5+hyvnz
                    TiFaWXLFGI/ymRO3xFIvA1pVfEnq8psWee2JjDK6rE5+cv4mZIKvb1cMLxwBi8pAp7Q37+DRuTYI
                    k9I0UNwObfvqYO9Yal53RNSq/o/UtKr+j9a5Ya6XsuNR33+PQ5HE4pwJnwDOwPy8TilHLubvmPMD
                    ams2jwGHgI9RAor41KJze8efnrPZwekuvZSYFJXV4BArr1gL9Ja/hr6cNLoAhf9tSGnAi9JWTQlW
                    1p6B36HyHzR/sPsDBAnDtxGqZCDVjwFdFHWoiQth251ZiZvaRKu370CM7u3IHDq1Zh3ZBhqO1sik
                    IdI5Q3a8ntCjLbwo5EryY8JRSR2M0Wty5937Zvnxtb3mNzWhl2BCbgEonSI6kleHzyAt48fIZ/E8
                    v9VWOV+5Zc1AZbH1wq6/9paOBH2HsC6PncfriTlI9zUVlYEZmFO5T3HwGY21S36aa28JRRRYSSDr
                    KpLc7v3fMrsLDBunt37uDaxYtYOm0aYs3MEKCjBw+SFwGy8vDgCdGTvEcPZT0UJxVyy7J/yf4DLM
                    zYTUCv9j3Rg4BiQSdyVlHDhtmzcIIAMqe8BGV9eqFf+/Yo0DNArkgZpfLqKFHQwJCuPfH22nU8pb
                    B6iL0jQuXU4K9ujKXjpxHY/toA3b/e/4Q9Cbk44heO58XVuNavhpt+8CVjgP/44NebO7fw+sZ1vL
                    5N1ErfM2ZgvvpLxlzrEo8QnKYO8CWwsAnaj69e5Vjmt/b8/teXf31H1zxdWoZ7BWW4RiJ6S3QW9g
                    ydyl3vrxhbYmPV5GnwI43pw1PmbgJ6UgSU2bMn9q5bh+O7duPKyVOfpAIzdkvg6pnT2DpnLuJ0De
                    AryYerpCy6iPHg0qYnhleP5u4xfcm+CBYmhtJCItFSQgqWJHQdpCThJuTBT0GAED4PcfR9AV+AKp
                    ECqvhC9Bcqo1JBDSM6dsOLS5fxktIUJ2du3oQPTwUxplY4d6xpE+3vNQaWXSmZOBYUhFdl5bhRXo
                    2fP7tv8bm9e/sG+3ds5Br8ysgGHMhNx9GBldxtiRuHD+EWudTPK/CjscZjs+tODPoyWJ5cv4nV2X
                    k4PGYM3pGL+txOLprHsd+XjIHlaFV/XCmtwLnMAmyPSMXBujHcozR/xS4REBLMzOEoLUIARUExhs
                    1Q1Kc3qtxckNC9K1w0dRDRtTu2Ll+By2fO4PaVK3hCDMMCEbbRaYVpT/iQ+3EjUugkLocE11CcOE
                    x18/OXWfWLYGE9c9P69WitIk9hszi8pZp2KA+REEMSCaESCWkMkuZjGIXVg6RlUEegYVvgD9Q0wN
                    JeFljSvjMaFJSQxxNxmyQF6Blj7cw5f2mOC+eGstNxKNwPz6tKcK2q4qtgYTP2b9+8zjX4tfo6LH
                    JywOaMJG5c4eXDhwSWM9yd6d8aA8ta1xhcGDT6i2BpvH4LG+JzsIrC69PVDfiJ9MhHe3rp4hf/w+
                    wdHXd4wCCcqazBiaxC7ApNxKGKhq+C61uM1eXK6dM5QLhQPRdb22P/smW4cegg7p06gfN7dsPbuB
                    W6UaDSkdqpj7o6wrt3Q42fL7eP5cmtW5HdsjV86Hcn0qc9RFqoyaz+3fk3XwQLM1Zxbr1NYc2TRI
                    isNKLoNVpcDOkElmJK9WISmECgGSMji1qeHIqJzgawHeNlFVGvo4W16WmY6eyCXBJSPhTrx3c3x4
                    ndez+c/c8bq9gtHFi80VhZhEtVZV8Fy0djbuH9rj1Y4eCCnTkZHLP8nrEyL3MKx5m64V9s+J9ITN
                    7fuAvnGyZgr3MEzhQN4Fzh19zPR3tPYDnVfwgulg3AqbQ87A+Jw8Himr8ElkMMDD27obdQgDBdQ2
                    wc37S5A2MN9iwTE9wptg7waW4Ct+YtYKWphT4CEWzlBPBUJMaXV+Ce2PChcNlSilxR+17YtnbnF4
                    OYj/Z1sNCfcsOiKSLiI1QgQJS0FKIIJIkSEsiWlUV/usgYYpfRUrKokxBgoEADA2R1MLxNF6wfUM
                    otzPv89ElMdHFBkLQcvEjXLB8/+bv9NKvYvWnpOBHijRcElgtVdI0/AAszVoFbSefszsv/JrDMcw
                    vGwYENX2UJZj8TK12totC5jzcuFdfi36SBWP6+BhoGlstlg3G7oAqXE8iVBkdjf37Zd4OFzbWdOW
                    UiOuiqwExFhAF+/nh45iwXmc4r7ocyHz+kWtqgPjkNW6bPwI558zFrYD1SLKxgzxOQrJCBMwElgE
                    DjIsdHLzkhUoJjfxcozL4KFlbwRZPmwFVTH67i0giVlkUYsUeUUIQRNjZYFhSMSR07E6vIk25RRY
                    26CWa6BuPypOlcRbP/s9ctI0cggVxUIE8BYc07YMOcxV+t1N8zVrGHUtJxJtgbzxlYKsu/GSxbvC
                    OxM6v4m8Cy0D8WB4eO+l2wMPuJALPFjUBoH4wnJYNxZvCorzb+e9IsF4hV7uWV4EZcKk4HR2FPTt
                    F3gYWVZ/n8xehLLqSjUA7uejrYvnAh933j06cwU9eAqZIKGlIzuPJw7fChvg9v3gJPNS3SOLLwJI
                    DYkKew4knB3sgQtdUDvx8szNhF+kckwUlOBT4sCZQRadwSl0+c4H5/dO0a8khRVzbviN3Vw7jvmL
                    H/3dqyDssjA1CsrYEEcldRUiK481QR0KEvNi7b+OHIbzdWsYcJLKcJLM8qinG+4tvBstYrBntSmS
                    D+Y7DM8YnB7voxfwgWdi/pwqDhOGAXjC29PLAyLoWbQ/Mle/u8EUdqynGrqAA3EhNxOjQCO0gofw
                    9Ytm3cDf9eTrCkunQVEyJesxkOLlnODW1UZKSgWytjFCckfgLJ4a3buKiJ2dmDBxFCUWxfSWk4kX
                    SwlZGBlaIc0rzdMWkGCXQ6/vfsD8Eyd+hEBLXqAm8lbTjJiOCgoIKzhw5zv7MBrT0Da3F9xWru2I
                    +2c8IUVPXogUItFeSJpJHFk0YCiTBfWRXYsZUQK+s/HPnt1gSWTA4sj8uLcab0j8HCxjGezFiE5Q
                    7B2JVE0dA3gGWmazR29h/5h2DhGoPcT2PNKKyy9MKCmN8Hy+HactzuV4jbSUk4G0Jgyfg+sAwq7Y
                    8+8tpwE5dHpLgI6WqG2L+waad+Np4yb/aUT21xmESsbbeuSIwIwxOKfs4fPozYzl1hRWCxk5ZGX5
                    4M7Js1w/iGoU3l+awNv2S/CxZmzD/WkO9zV9GENzW4p4wQub3McfnDlncc1VHFsnRoxjTMTMtEvm
                    EbFIjUUCEvRJW8NAqEUkggkexH4spGpAKnFh0xZ8zUD1f4NmOh8764DBz08cLzmipc6k/i8o/Awi
                    qAGmRDSAq2xBVRNPQNmoWioZ0lQ/4QLMy48hNg9tQNxfCwhK+uo8fWsDlMTHgjuwAPEtJx1jMIBz
                    MK/jRY5k+bA8tmJrCnegwhLRkuQUEHCdWds+dwv3P5+bB44uYl8+Haqxt6tDLE9atXuO+ObdmGcB
                    19uBGj2LGd6dQVEerqh1nzft3Zv2Z/CBZmc8dPgLO2HrxlRQgldgmXU8So0HDcv9T0TAmbDLV0eD
                    1y2rZGjoYOcnkq3P2halk+qoUEFpEUYmQlSH1LkWCWQ08eZbKrDXYs3/hNmWTGKvZAegH2Uuj3tL
                    YK56urvgks9zdswUwHH6xJzPsmsCz0iMXOfoO+CJYXpAke3r714VOTsWv89PYdVo+e+MU5rszYOM
                    vxqmrczuuHR6l5OOMVij1J2VwH+BZj19hG5XBq1xkupEfC5GSRKCeDJAGPIlUeMkxNsWjwIBxavQ
                    LHN6/HpjnTUR4ZiAd37+DF8+f0/3+RZLiOMeGx8CeB68uXhpciH3ZG+hjeMA7vKB8/DCzsflFZdD
                    ychcoIkRQilqKfdC097F+yiPudLUcxyNcZyaqqKJBXQ5oEH1mUcgj5uZLiSJUWR7CkGBwkxNCHvj
                    OV4MFaqI0EC08c3X3omzLKwLKDKnuzvxfu1pbidHU/AsuXh6U/Gjvve6qsffUNlIZwd8Z/zxhYFv
                    jGYntF3RfBwlj2a4Bg4zZfKwfHLNVluJKfjxuku04GR2J31rcxCzvn2YPHEGPlAidFTcQIVJApJY
                    csciXJFKGGSUsS20vDV00VSV07IaFbFwS1aI58exsuv8wab97EksIS5Oi04NouWlaAIHUVbkWvZY
                    u/XT9+E1iYLZ46G+4GreAjLkCKpAhZIiVMjgzHk2tEcVSxt8+eRrVBCxTKKNDvPMSKSVCo3fRQGn
                    v1pWRDqZe4OHpTQa0k5WGvqI90ClXPHjn5h0qcVeyG3AKs9ffA/fpSXKj9Y7AwY5XNeja7Gfi1xv
                    xoDCxLKYTcXUPh8De4oW+1t43PsL88H5fys3ElNRWHQsOwI7/4D8HC8nDtxCnUh8TAWaSKKJEGcq
                    UVUS4hj37UaVMlZBAqIQ5v6pDuBBpvYhwfOXlKitzYy/YFC3FwzRpMJsHbr0Ub5AnUUCCpjCS+Cm
                    JbtEV9agE2bTrw4Wp/bN8MlqePn6Kewk9feU2kEiBKRcooo0hnSUo8np47i6fHjmGwnjEKxeUILN
                    IIo7DMnwATJMbe8xBIr0702YIAw26Js1FHO2kRrFS0UBQUgwvHTlNjfb2BWMVuzMjHtiA/PKnrh/
                    NlWbi/fw+eXL6Exx/SoysX8fDyBe718ZXLeEhu8t6FC1x6fOkinl29TNf4egMxsKz0D8N+0hdfuz
                    nJXMeL6zfx8OIlOv9lPKLrsp1RnlygPJy/iEeUHl68iPsXL+DuhXP0eg5Xtm7AlqQoXEhLxu30DB
                    whgbsz94/BwjTQ6IhopOo3QyRfiHQZAom4ENWSCiihDpsmKYsQcUl4sUeL+ZKIIhcfy5NHrKwqt5
                    NZkLYOgrQ0ESEUIltWHlWyaiiX0UCWcjOUO/hj84I1ePrs2+dJfzNYmN29cQuDIhOQyFdGuawCKu
                    Xk0F9DGTOs+mCBnR0GKmqhgjRNgrgEuSsxeIpRQYiJQohFmHL3Eyf1TWBxZlviCYRwo8L1EBOHi1
                    4L9AuKxcWTZz9R52+NVeyu9EIcCg7GnbwUnEyNxJGiTBwbWI2rm9bh3pmTXLp75jilE7hHTHfn1C
                    ncPH6C0nHcP3USF2dNxpPTx/Hi7m00kvZgr+9f/3KDk4Fls3cgjhXkfwLLT/T76/v38Or2Hby6dR
                    dPDh/H1QXLcffkKdw9dRr3Tp/C7WPH8eDESdw/Rtc9Rnmg97dOnMCNE0fp9SiurV+NYykJOB8RgU
                    shkTgXnkhuqOSrYGH5eHLvHk7v3IECI0NkScmghPRiiZQsysT5qJASoZA6WhKBxY+tekBgCeVLIZ
                    2OSSU3w1xNgJgMsQ0P3nwZRBHzFEjxUUMgqhAZoLqjLabm1ZMEaBoC+Vb7U2Bhtnf5aqRqt0AxgW
                    UgTxb9pSRJzPLQj0KxOr4C+lOGU+i7MNIpzhISpFOoQBIiRFOKoPeeBBZ3os5AAR8esjKwoIJaCU
                    Xw0DdBaVACLp+68EWGYRV7iGjzsLcvTpIrupAQhofrVuDF8SP41zeMtzB7d/sm7syehuPVJdhdmI
                    Od5BYuLVpAYLiPtw8e4t31G9jt4oXjCQl4S2B68+ghzs+bhb1Z2Ticlotj+eU42X8wHu0//EkPva
                    ewmEvPnuFncnc/03fslYGNRWIsvP73ixd41b8/zvsGYq+lE06FpWJrWvlXBe7zp08wMDYa8QY6qF
                    CQxyAZHmokpKmueegvI8stbZJLzBxF33lKSlB0QwxOKY1+yyKgxBGrhBNYvAgsYfKyiJeSQJ4MH/
                    0Eqig37IQxQenYumAz7t758potX7M/DZa7V69jbHwqClS1USsjhwYpaTTIymKoUIA6KkwVpVyeNK
                    J5knAk0FhTr2CUGCkmS4Ug2iRX5MvAQqG0Kwvf2KK+IiEc+Yrw0jBGRXAyrjDA/EYzsIrdm0QN7O
                    yGzZZ9cSMtAe9u3cL7l6/wjiUS4WyN+qb0Em9fNiX229sX9MoSfX66di1uVFfjTEEh9iWlYn1QCF
                    a6+2BvQBguBMdgo7ktdnj54khqEtZHhWOBlxfWeQbgaEwajhdWYF/tIFzYtAmNxDYHxg7DoVGDcW
                    xEPY7VEBjqBuJiXT1ODxiAR8RqD44cwZ3t27k78XcLy3DMPRA7bbyxPTANK1IomvsNWFiZ2VSOo7
                    t3w09fD+HkroeK5DGVWLieGLg/6b060iXlVNdpBKBQChZ8KMJk6936SUtQ/Uohh1gnjfRMCHVK9h
                    iyrwxpRilxpJMrylDXRbWVO2ZWjcaZk39+dYc/DRZmFw8dQb92piijELiBJ0QdMchoCpNHCgQYRA
                    XLokLFEWDcCBB2xB7upGHCSbMkEIVGUYFCCCzBMqRbqDCW5K5sSNX7ySrBTUoe3mrNUR1IDMM0zG
                    eAYVMKVmeVYXVgDBa6+mBPShaOldRiY1YFVuZUYUFeNabkl2FiSSmm9OuHmXkFWEwNtG/sVCxIzs
                    fOoSOwtl8p1hVQyimhVIaNBdVYS+dcFpuNVdEZWBOSjBXB8VgWk4pZ0QmYFpuE5dn9sKugFjtyar
                    AqvwbzqwZjRt0QTK2tx5yGIVg8dCgW19VhafUAzC0sxYaho7GgvAarG0Zg87iJWFwxAIsz+mFjZh
                    nWhmdiW3IZjoydg70zVnDu5qOxsl44eQ65IQlw0DWCn7wSaUMeBpHrHktAGUdpDLF3LdVdMdVZKt
                    Ufe2rUhT7bU/0HUCeNp86YwOqZGCeYwBJAQGF6JowAFSUvj5R2XTCjahD2bz+C6zf//BKr3wWWJ/
                    ceYnJ6ETKV9ckPKmIE0d8YavDhlPmBBJISYpskSt6UWXtiD1cSuyzz0eRfY+j7SPZAExXSh3qDva
                    w4bMin+pL/jeKrIoinCl8FLWT0scXRbb/MnGeuafuiLdhFlbxrylIsrhqH1UPnYvHABVgweBVmjl
                    iHaVM3YMGK7ViydieWr9yCjRuaZozt23KYa4zTpy9gw+rt2EjHbFixA+uW78T6pTuwafE2bFqwCR
                    vmrMOGeeuwasE6LF20DiuWbcK6VTuxY9V+bJ6/E6vn7cDq5buxchWltZTW7aJE31NaT+83rN/HPW
                    R2+eodPGtsmln4/PkrrFl3AJtW7cOmRduxf33T+sGfG8vjsV0HkGDnjb5KOrCQFMBPSkgMIYdaYu
                    Qx5FLGi0tjHGMaqstySqls7RxKLvTeWUKKwEIhsZgcsQsfSbJy3MoX7pQ8ibnZdjL+mnooCojExS
                    9sOvWt9l1gYfaQxG6DayByFDQwgMDSQBkbRGm4QA75xCwpJHKDKKOuVCBX+t6HEluyI4JAFUGACS
                    fg+BONslWmLLnfCf1sbwDyub5iPIq6FBHZqRPWL1rEFe63Bdy3/STev/sJF07fw6LZJzFn4Xlcu/
                    XL/JKfqNcu3HHkw6e/bjfvNOL2vR/7DNTHcm1csgwORi3RmUBhy5dHIEWcoRQUpIkJUUUAGC4hh1
                    EkUEcSWAZTfZVRSqG6DSFd6CNJrEy/h0spIkaMtCGxSzRpSG86xouOcedJwENJFWnWbhhVNwZTlm
                    7BuRu/PA7yZ+y7wcIK+YBCyKKeVsiQIZ9KomucnBBDKfMlBIIsokzmK30o0wwsLHnR5wDSMmwlqW
                    gCRChVjhOByoktFkR0GyVNSl5GgEii1CDSO15yPPi0MkZOXAI2bdz84cpN9rGif5s+2m8//1X70e
                    djdnDzdlQkJMGrTWvYkZB1FSjAi8LjAAqPYyQUkEpgKSJmGUAMU8+TwwDqaIxV8sm1xDOwUH0GEa
                    uEEqCixRQQS2CJIrBEElg86Rg3OsaKWDzRzBpjyobiwZ2mfQm+txzfDRZmbOuZ0TnlyDbpgCI5Rd
                    IsSmiQkEGppAyBRZJbrJC5Hw9K7PFIZ8q8F1+C9IoM9QI+iV4eByJnSt7kk4Mo1A5nd6il6Xc+uS
                    shgUVRBBsNTfj3ssDE2mHYvWnXD2+0f9JY3k+u24+1w6Yiy9oZzpoa8NZUga8yu+8mg0ByP3Eyyk
                    gisKRQHWWTBiklVikjTVgkI07RjhiSqR4jKQVy9UtsTcfEEqjiCVxRxDLBBBY3kgS9qV69DFticH
                    oZHt75648S/yWwsIuzJcbGJhcg16ANKqWUMVKoSmG0FDJJqyRRYcJZhikxsDgytBMtBpBwY2CJIr
                    CwUJqBhflXtmgQt3Yd6ZkwSlFEu+E8Agyxliu5O3bHOqCHLZbMW/jV8Zj/ZWO6a+vilai1CUSpsR
                    mSNAzgx5PhIho/WSkEk9aIoJA4mpglWVyEJHLNKQSGbOp4OXKSSOJRZENuPZzcTyAxNIsqg6jOoi
                    nCTCTAJJPWiSJmZnsN2cvJo6+iJkrC0zBt1CK8IO30V+0vgYUZA8zDm3cwOigJNZptMYCvjFI5GW
                    TzWQ9gqJeA/wcwODOXRDG/H4ElUoJFRtSTKFJizONGib16UGV40v/8SfdEENNEM5oljeMhySd3pQ
                    xrkS5sWnfAqEGDsGndarx9+21jLP9NY09L7Nm4BfPGjENYmy7IkDdAqawWioTEIDKSpOMoYiHGjZ
                    KVRYy0kFhCjoDCIhtxStTpWMdjQGHHke4LIeb1pTr0IHfP6pbdUkkmd54oJYNQ+t5NVgRn7WZI8Q
                    jHyPqpuHP7IQn8v87GfxkszDjAXLmBaXYhKGFDyvJ8ZPLEEU/+MkKcRzG/DKlzCQ4wblwURAKXCh
                    ZBQAmmV8YoDCxsxSm2H7GjpAQ86b8h5NIi2HEy7Dg+6Rg1uEmqoQ9FYL011eHSpS0mDx+CQ3v34d
                    Wrv95zfrS9ffEaF/YcxcqRkxDXsSeCtQ0o3BUgl1h1iEAVA4hJcqg+EqmDxBBbRJJOiyN9kkxCP4
                    FYJY7qI5p+i6aokq1BzOZAx1JUFEXM40OBANvLkrE2u/cWTymGOmKwLA8B2oZItPHGjcvXsJAiuV
                    dvfsx6MT8ELMwYxW4obMDQzn1RpsWWz5RAJPWAMCkRwsQF3D0iL+opLsQYXuSmQjnASJHflYQfgc
                    ObEvvNlgptTYLXhYDkS2AJIg0TSpUYQaI3VloVAWLycJOWg4NAFr3lpNBHXRHu3UwxfshIHDlwGB
                    fPXULjs//eyg2vKGS+ffE6zh44hoWDxyGniz2iVVsgWJqiFdmmm6xswvsQvgi1VA/FxKIp5HoT6D
                    WO6iKeOlcCsW40a3z6ngGFMUoUvWeAYIwTJ6ZIYFGgjsWHBwEmglglkuoumNxZgKoKEnpaY1i/ob
                    hw+Q5u3n+Gn38zwPm99sPAwrHLxRu4vu8QRnp6I16dRClbK0RaRI0tokbnE3tIwJYK7UI9IIgqJp
                    JYI4SSD4HBnwQcc1G21HtsqLc5E1i8yE35kysKpYpg7iiJzsPUfiALu8mPu5LIY4s79yFd00OoAu
                    tmbRBq7YrxNUO5laFvX76Kmxev4PqFy9yqVs8ePcXLx414+ZAq8CtD7d9ibMyGzaBnZX754CGe3r
                    iFR3St++cvYfGAkejnGISQlqZwUdaHO18F/hIiKqeQ2+I/msqbTwFAKTFEObnXEtIsqYxdKKVQGR
                    OJUaKZaKV6iiVdEkvMEkvvmauJp/qLJ10STkDxkpAnty6iTkbnJiYKoHoO1NRHVI++KEkuxNQZa3
                    Hm4p0f4n4+2g8Dy+e2ZvR0FJi7wF9ZB57EAsEk2kL4Qm7RmL7UwGzfvlACQSxVWpxQkUQej7u97s
                    jAQhXDNoJ0IjB5EmBCiFniKCVRRabQK0sJ9FsM9cQotnom0S77vzP1WEtioj7SsnBW0UYkaYOkbn
                    0Q1c4Uga27IssjCENSizAjsxrzUvvj9PqdeEbi/Bk19sc5qr+1N6/e4Nnjp3j04BG30NGje/dI0N
                    /G+X37sHrEcNw5cwbzohMw2tYNI7pbYUDL7ohlj+2Sq3GUE8BeJIKrLAlOCR7ciQFsybV6Ejhipf
                    lII6bNpbrJpZA4hcrDtEkygSSFWDWWdAkTsTEkehmbpFM9cPqFysgmzvtIyRELy1LQICDdogRvKX
                    X4Khkj0dwdAwtqcPTYOZy8dJsD84+0vwUs185cxfz+I5HbzQLBcgrUqyj2FyjAm1yHBQHFlSoinn
                    RMEgEmkcASo6AED6Jke+pFtiwRWByYu5KkXkaVk0Epj91zokrNospjKZuEYbYcDxkCiiDov77U61
                    ij+MgI4U107yNQhCdRvTMxmh31YlueEB5KmohWNkSORmtUNOuOqg59UWHlhiWjxuH506fkvp7i+b
                    NneNHYyK2kNH/kNOT6JSLc2ht+PawQ0dUUSa1bIVZDHSlqashWVUcanTdPhlyKSBOVpNcySXOEU7
                    m8yK0y8LtRBwmgRmYRHwtl7el7HypHNLFmKpUrlfKcRHlPJpCksyiSXEkysWUERY3hVBdJdGwOMX
                    QMYxUClj8xkxsxkj29WhKIrKUIMIr6SOxqi5EFA3Dm+J/bI4AB6s3bd98ErL8FLMzO7zyIRcl5KG
                    vWknwvGzchhhFQbyM340G9JJPAUkz+N4ZcCntUJIDPHpMlvcKBhQ0oSXMVE01MUkCsVMEXoII+96
                    MKZ6mMRG8/YpUc1lOpotl4QyBdJ5Qvjwg5NvVQCcH03o96rysDEkUJEdTbM0kcl5JrKKdUIKOIeA
                    JWkLoGfI2bw7GVCdw7d0JEz76I6NwTXlrGsOarwoyovzc1qgc1cLKELIpl5On/Siim7wtIYwxW0M
                    IIZT1USikSkKXJlTBhT6EtaYkAYs8IAhDTa3aUXKkDhApECGa3Pug41mFYeJwlI4NCkZBCZD4SiT
                    FjGGAIbHEEoDAqLxsBZwNwkRQSe0rzYMOXRm9iHksFcm3tO6GBGG7LvMXcKtsssScL2ay+psTef0
                    z0+7t33Pq2bylKe/a0EVU1Y/DmzR9vzvFVsLA/Mt/8S/o32Gx5Nnur6fWX9OvjmtKxVRtweuBIzL
                    N1QbqIGoQKy4ag2b2MUGrcEjEhqkmsss2tmI/2IIA4UOHZ5uN9SI/YswEqovA4aux8ou3+1KvqqJ
                    L603lqKNURWCr4MsgiFmJUze6ystl4geTzI0hQR5AfD2erBFAUxXp1MAExiS+JfuSyaikMH0xsN4
                    RYr78Sha8KbAcNMVhQuG9OxzjQdd0IwG6SsnAjMHjwZUlTySFBRg7lPAUMJ1czVKCOGml59KNr1K
                    hqopwYsoTOl0EskkwADye3wzUuMU8U/cefIiB3YkcXKkOggjy8OYAzHcLAwkBDuoU+s+kdSdQBWG
                    SUIJLj9kvwo7yzOUAexEqBdH5XAhpbfKcT/dab6iuylTH6e3uhNjIaZbEJyItPQV1RJQZml2JwWh
                    lGk+udUjAQE4sGYlBGP2SHxiLU0RPu5g4wp4CEJ6UKS9fQPxTCXwULezg6MrYQ0SklKK8egdkTFm
                    D5pEVYNGoWloyfgyWT5mP+hLmYP3EeJjaMR01hJQpSslCf2w/D43NQ0M0aaar6SKZGiafeFE49hN
                    2rcCNlH0lUW0qNWc8mdhNYQqiifEV85Fh0Q7GnHaLNOsJORYEYRoJcmDQyqeL7U6M3UO9m96CGUh
                    pBTFFLojiXKjCZABNDFRdFlZ5I502SkicA8kkXSVNlS3GheShdN46OKaRUT5pgGIFzCKX+0hLI5o
                    tzO554EmA8BHSsogCRivIIooiNhaZs/IedI4pcYz5FeFWkwSqJYQqo4StaG2FNajRmeDohTU2RGl
                    hIukXIzYt1oLwxN+RJbtCX2NFLUQm2bCheRRHBVD5WtlAqO7tLnEYdIpHqKY4Nz9N/k6hs8XQeb4
                    oqHSkltDNGjKEuQgjEPgQWJu6dZKnzUZ69yCX7EMs60PmsZPjoSuXuTuV3E2rBQ4Y0lLgqCWIVuE
                    urwImnBHsCry0xb19FDbRT0IYSTxlWDn7fB5affvoZ9UOnQlZOHTJEuQqkN9ooa8FUSQtdSAt0o1
                    7US0WTkha6C1XRXU4ZvenCPei3XmxeCv0vkCKXVMpYjpwi+WByQVRpjD18yBfHy8qihIGFfHytEo
                    lRqjB/aqCnJCAZo7F0ctdOBGppIpAaLJOAMYDc0HASdsPJpYyg40dQQ3FgIapm4w9sEwommuPE5Z
                    Ak2QSWIGIZRv+swdnQOIsoGFgaCKzj6b9jqVEGEViKCSgJBCZuHIidh35nDc7Gd9h5GWNxO6IQWA
                    oILLXkCgaxVahJt8yLCGhiW8rznpFDkKSvCT8RCVoB0xTU0ASeArOeWJ6Xj71Dh2NFWSmiOrSBNT
                    Uwt0UPT5ZCYz5iKCWQm4zl8xFJoImihvel/4fqa2BdbTk3neHc4kVINGpOOpDcGHUufxGFywISw+
                    SywomN/BgwCSwupIW8yN2G8tUQx9NEIk+DGFoFwRJyXETKxrNY8MBWU+9AbliVGNLdPZDzCL9nXw
                    HLT6gYOh5S5D74pOgVyY+2IMrvQZrDggpvoyiEnbICHJWV4KzYtN2Ig6wINkSR9mI8YhFlJMuoIF
                    1GgWOWOKJfdvPQnyIYNpwfQZWeR/pisEgLBRRWZgqUCUR8DI+JxP65M7mHsp7evIHB3t7k4yWQQg
                    1bKRRiBBVsFLmGkdRzGki/lNE5k4glwui8gdTojPYjqELiCKRxssrEDCxiEIcjNbQ/haFsvCKD3p
                    dSGki9cwj1eLYLGxv3YBtuhX4ARjCxEZvzGkZ5DySd4kufA0l/JFGey+j6NRSJDKDrVFC5B7dtiW
                    tTJ3KAYQ26dEA1wnU04EH1ZEcskti9C45vXMf9xmbPsVemGyZlpsFbUx2OVAY3Aoc3NV4QdYhgco
                    Gh9BpJLs1XIESJl3vTf1knomtsHDEakWwhHiqPF69pP4UoYpVoOXJZ5LodqCwO1Gl86P8+JO7D2C
                    xFGSVqExFXDgYU7qYuG3qgOjWlNlaheuvZtTeWrN3yu+zyVWapHjUZ4tR7paih1OUFaEMZ6kE9rh
                    ddxIz8aR/qGTbkLx0FfNiQYrckl2FBGWW7n/mTZoiUkEcigSBaVsjd2PKVIdQTULwJKOEk+tJJHB
                    bJUURBQjOKkO1GPcJdQwNeJDQLQgNx9vAhXD9+nOuVQcQe7GH8gcRSI4hCR0gLSbNQhETnjCBB7E
                    WJRVjuROHe5KqCiQ1DBRRhkcZgvZvlk43HeFCeWa/Npe9r6Fx1PHmU0fE5BJgkAh8DCmMWT6pkX3
                    KP7iRMHUmIO5CbcCPAh1C+M4kBKohBKwm4pfLKyFFVQUmblhiflowj82bj+f17mFs3AE6KCuhNQJ
                    g/ciTX2Gxtt4kD6jCquASrJk7kNvhcOWIogui/VlQ2ZzYnmcDnSuf3Ip3jS+LcWSCPDDcnDij71q
                    /FvFGj0D8wGD5aunChjusl4MGPOjG71+ZN5XKnVxae2xBobIkB3Ym1vCg69CTQOxFQrKhsltRR7M
                    mFuRCb2vGk0Y06qR6VTZGuXVBWh/dEFF+zr4KlYthUiFG0IqBK11VQRluqYEcNTbiSa3BQV4Ez9R
                    5PI1146lPS1oM7od1RWxeOmroI0jVGpH4rxJu0QbRxC4S1MEQQ+dsAbU2EaWsjycAQabqGyG/RGv
                    nG7RCja4Rgw2bwatECtkYG6EPHDijIxZUzZ3DhwH6ktzFBtqYGCqgSB4lUMZAauZiN0RCrxGsoI8
                    JAG4EGOggy0EOorgEidJshQq8FQpu1gAedz1ZPE04tDAiIRog0NKJrGyBdQRXJxBJJJHZjqWxhVF
                    ke1GChRs0QZtIWXnrN4KxBPdjQGC4GzSlvxghu2QJxLSnfbYxRZmKCQgJ2UstmSO/eHkkdKRx3ss
                    PJtauwlZgmzd4afam8A7Iz8fTRQ7x8/hxubTrB1agV/Np2wNLJk7F09HCkeDjDvrkRvOh8Ac2Mub
                    Xewg2o/lq0QVib9vDp0gkn9+yhUP4psgID4dGuAzxatIR/CxOENqe86ulTWQ0QRvXH9lZw0tWBja
                    4WrLU14KpLoKI2c6ZQ353qyMlAE466atSGSnBUkIWlrAy6k3hvTqDikXuKS8nlIqmv2RfBwtBVNG
                    ACJCSVoCTUgBqhs62UEPk2jjiwZi1uXrqIW5cv4faVy/TK0hUu3WTp0mX6/iruULp7lb1e4RI79j
                    b95w4df48+s6VR79MxD+iYu/S+6Rj6P6Vr7Nw3bnBLWrHplA+uXcPVAwcwsGUbFBO9FlADpxFtRx
                    GrHVi6GHfZuSlx12Ln+pg+nPM6nY+d99bVpu/uUh7WDhmORDVNYi1iIgKKj7wiknr2pN8pP3Q9Vh
                    a2W/ot+tz036u4fY3KQ+e4f+0KtxvrfXYu9nr9Gu7Rbyy9IGC8fvYMD2/f5q577/atTyuUs42ebl
                    6i/Fy8yK2z/4yOZb/fYOenxPJ6m83XZee9co3Lxw3KK1tlkrHL/Tt3cJ1+Z/lhxzaVl8pN52X/Ye
                    e4SZ/Zda9fojLT+xv0ytItqp+bV9h3l3Bg3RoU2dugF+mczsRGzciDyBBYIuLT8e57wFJYORo8GV
                    WokEhSIx3Sjvx0gZUjjq9dhzsXz+PWxXMEkCbQPH/8mPsfK9ANqrC7N5vWb2P2srGRu+v60dgs/c
                    fUAM/v/3oFyxcPHnJ0/SVj3986cgij+loijbQRux2fSKI5gFzk6vFjcf3MqV/tb8SOf3L/13NMHz
                    24/0nAvW18js0jRiFZVx++5K+DyFUysER36oirJ05wILhx/jwH9q/liZWvkQD9/OYtrtzMXtA1Pz
                    +egf31Z+vJsuPYDuy3LxIIqdEZSK5SA37czZ7tzPLo+k1ugjkzdnzjb3bmeET19vkSZ+/evMXLZ4
                    0fPn1oA8r3NQLIx3yxpTg+f5LyxcOHGB4SAUsKXNqShNAnlpYisITGpn4fWIqrRkFaUgQFSgbEKp
                    2Isr21DZDVty9K/TwwLCsRWxbNwfXzZ/HsQVPDsMwlR4ehJJMu+u4tNxI6d+worCZf/urlCy7Dp7
                    ZsQ42bF2b378/9hxnrQWMz83Bmzz6uItgMd1aRL6miWeXfOHUCte7OyG/dBpEkWiMpyokiEcgmC3
                    lrqyO+rxk2LlrArSLArrF/x05MGjyYOzfL0xUCdH1FCdd4TCtsHDceBV26IUqJIgTy7aGyBDyhCC
                    4kSmO6dcOYtBSUh4cj09eXG9H93Fj+2BMEbDHCDRVVmJmS8alRVjYM5ZY2ZcZAwpZGO7y9aZd4Vo
                    5TBw4h08kL/SMTMKeuHnNGjcSkEUO455GZXTp+CqW+odi/rumR0p/evceYwjLqkFe5a7COV0eaZ9
                    emzXhPv7FOuGX5akwZPAJPPyy3fpXYJNjDA+GensSE17nv1i1eir1bt3I7nbEBuQOr1yO5U2/SSk
                    poSSDRJXaVJFEcFPOdYMmvGQYxEnZCoigDUujdKPWhSrXTVEFDbgYObN2Axse/Rj3LWPc2zeBh3R
                    tv3rzGgS2b4E8N6dCxDY4d2Icnt++g1M4ZqX2tsX316g//AgYnpsCORFtVUDieP3mCkwcPISM4BP
                    t2bOce55jVrxDW5HICFRQRRL0gkkRgKBXQl0JNW4rUupL4jnd2wNVzZ4hBHiDQyQnRfn7cM9osTz
                    GBfvBzsOU+nyEgpZJo9iCBGErRQJRAjqIPHvwpsbXru5Norgj0weo5s+Bm2hXH9u//FVswl8L26W
                    GbT01OSEZCtx7cNX4igPf38ufyz+zEjl3wN26LtXPmc5/Zrh1hPcxhp2eMzUuX4/Kx4xx7XaY8f+
                    z1B7bugJ2+MdbNXcB9Zmzp3b4rCj0oPKdr7F25Gn1IrwRZ2+LBnbvkVq4hxjsQ5m07Yf3SFRwQKo
                    uKYExaZcq4cTh75BjHpuOHDUd8QADn2u/fuIlCT/qPjDK6icmhBYl7bZ4AEiTkA2LTvg8sWQMbIE
                    bRj4KiAGoUlrYnMdSTGiy2TzfcuHCOo+HXxBbPnjymHt00l4QVyKZLK8ydPJaj1rvkkhZNm4xZ48
                    dwvvnRrduocvfGipGjueM/2j5ybXNGjMC+NWu4xjh99AhyIsOxb+d27lmfucWFsJKh0JLAEkaMEi
                    cnRAQxTAC9d+Tx4KKjjWl1NXjx9AkHiOUL5mPOlCncCo0sTzmxUShPT+WY5dS2bUgxM4UnRXihQj
                    lEULlCKSrwoUjJU8RHX4qcKoO8OYBsXrMSW1Yu5240sgZlC+aw71nZ71OvHRQagVwXV+4adxauRG
                    kPC7wkymd2isASQSJ145x53Ge2oHJUxx7IdvXiPjNj7NNILvyjezxC/xmUmonHH3Z2Zy4mrJsZSt
                    z9uWtsW7gIrm07YtLAQRz4Gon1li1YhKnjx5POu8IxR0VRPjzsbLnj2eOvjN3rysswdmgDx5IPSE
                    vlB4Sgq6Q8OokLYUQeQ4MiO3EJOfjFZXwfWHIGE7NQuKmkpAA1CsfaUk/uQv49084G90jUNT66j7
                    qMeFhTlDG1dgD3P5bBIPOeHBWz97+1R1QJZY6uGJ9X2FTprECUObYu7efHnz12FCUJMTi8excHls
                    XELM4UXvoTu0UQQELF2V6NbHSWjStIIKZdO1w5+eWlU9l5s0NCUZ+dy9H2yc2bkN6jB/xE8gghoL
                    FnmCIJiGHs+SZpSfSSkICjvgaekF//mCcGjp2rVqMuOg63Tp3mljmf3zAEowqLsGtx07Jnt5esQh
                    ExB1uWg9kZavhYAsvmT2B5jtgupigi18aMlbuawOasrsWJYWaHtm3HwnETftEwBO7QTt0xODiKu8
                    auRYuQZG6FWxd+0SOfG2OWAcV5cOjWhesYlw8fwcT6eoyg9nn2IV93b91Eio8PtacAbaVFFDYLoC
                    KrSF5EAL+E7O8DS8HAUXQCHhSkRNCnE/XkqcCar4KYjt1JUJ5FI1Xm4PQs2OoYYkppk/5gBXBp1h
                    pLqwfiHVuCgiqZgeIjMBrv3Ue9mw+iW7XDvvnzuO8WFffDqvJKTkuwHsa+O0nhcn6QPw6TG3pPYF
                    ldVAhHAogPgTVDTQOpfBHiCChhlNg6rv703dEtW7j/c4ldk14/5qk8IgYNKVlcTz2zaSsyOpnCnz
                    3+ye7mEujipCixQS1yRW4kms1kJNBHSR5PyN2wub6X9h9EroMrfAxNsH3+Iq5cH8/98f2NZSuR1d
                    PsE1jOkrtLNGmDrXOb3BBjkWQrc4RRZ2J5WztzKsKMWxEzCvGQRDKzfZs2oRuFstOHDuWu+5zC5Y
                    BWbTE6Mp671qHly5HQpQdGh8fiKbH0x7KyY9nvDCwN+VnoIC9EXUw0Bzb2/ed288Y1RHi4oAUxcz
                    NiFXUpOcjzFCDG5sSkFHynZqkeBRlpBSiTwG1OYOkuRpQvUIOFjADHdjbNsGchsoeuCeZWDeL+x7
                    4LMGoDb3V9rM4pwfLYdGQbd8D/196VR0V15F2RfemmoREEIcgioKgwKoqCooLs+77T0OwIAgrIpg
                    KKIKiERIO7EeOSmGSSmInRmHjQyLjExLglKkTUUYJGM0Znkpn5vju3Hmdmck50kjP/zPyROqdON8
                    3bqurWvff3qt6rqlmzcYNRxrcM/Vb6+CFcpkALpUFU9O8aVyDeyhIJtjboSEuWXuZ79dOzaMvNwq
                    Xek/iBlfxOaRkSGbGkGcqRTMDksJEFu6QyfI7U0EAAv6fZO2JTQSG665chlZ6kuaREuh6Rq2Pj0V
                    lEPWblXf7gQxROckeYFsHGiEpNxhK31pN5DDEsIB7cDzTQl5ZTma6lgVArK0TQTwUaKRAsQGrjhB
                    M7d0vHFWb3ZNdL0vfBg7/DEjKWiAzF31d6epA3zglHdw9v++S7R0jzmISZZobY3VIv/daamobi8a
                    7SMIdIp2hcp2pqYTLl0GuSPTICfLDAVIlXikul7S8dfAeZjuMRYmSClfQgG2srkRHki7Cpk/HRW2
                    9IsrO5shxTaBti7MbihQyVtESM2Pcf+fatAahiwmHHsj+nbQhTgkVfR4YRYkZjSfV/BpZagkVjhD
                    4s2QMd2EAebBhx+zqYFRllYYYzRw4zBLuPjWlqbKmolfYTF6O2dYBKYYZCYyWWKkajXE+BcisbfH
                    H8OB6TWbaERyKCRjnK2hzdyyqlfXraW1BoOwYdgX485hCunjvDqCAEZw6/L/3/Ec+TQAZINZAjUV
                    fMuBNjG5rSY7GBBEuwhrh7Sc2VK5GgtEQoGzbVzgGntu+U9l/LXlYW6CvJx5c9xygH7vCh5IQb6i
                    JGuguqjVhWsHjUU4wPiYWaxBBBkBjtJWBEjqZ/y6AM5ugaoMTMAmu95mCt9xy0+8yTziHyRpUK+3
                    LV0mKV/QR6mesE1HjPwu1PTkv+rtTHEzN0RmC+ubHECie2b0Wl1yw8GBxeYu4UmWUm5XA2feI0mQ
                    68+emjp4cOAkMc/+ahQ8hxcEKkkTFiR1vB30wJD1673xhzvL1tiyTnh5ubpBHpKBNT+FOy1VOnIc
                    VzBnIjw6UIc5CSl8fOM5qG1ooSZKpnhBGMLkfSt6Qv/A+YRdzBbVizBVojZbDUl2MMG8RNk4XUG4
                    kA3ZFYwEotnzkDu9l71wSHIdnaDlvzC3GitR05xibSentVxsZoV1qggTRbpK2N1XO80J2egoYJrk
                    hmBBKuoEG1UeJoe7MUhu7NUmHJKCX20au8VlWCYg83FE35DV4rK8er2XlII20m09gmyo0RSo8RxK
                    hFPHi/QDTqCA1p4lMiTVqSpiESqcVJhqY0nN44tv55rImOgpfSBM1syBZVKhJdHDFfpo8AsTI+I6
                    BQPR2G4cMTlMTYifSkAY8rwCPmBsezQdK4nVpXH/k8TzlBu9zCGhUEZ63FGLzL8LmndjkaJ05GpZ
                    0d9qjV2EmfVOrsBJWNFZrDArGrrBjq8eMwR5vnoA8Ua09uycpEmoMdyn3noZsmfnVCLBYoZPCgj/
                    LWEoOQ+tJ7ahPMzFjXi1h/GSiwtkUkw30xYBhtKEOYTAY/Bh6pLk7YXJSH9RGhSFQQTIwUE5WjEM
                    A6m6arA3ceNzc6EnULF9LTeEDJUFmpqQdjfRl0qBaCWeaFxGH3b48QME+/5f8MZvkblrZsggYlyJ
                    ySYSnAQh1fYKxLitZEIAscYcQoggyTam6OMIbXqSYmKOL3LDbgYkYatYYECFmogRRfwoLnynRRaC
                    pHvhElRFsLKcZiDEQDhZasiOwsrLN3QJPMGBVKJYp4XLVcDrWBDIUKJXIVJkimXIhh+GiZIfy1NT
                    CX1yQmd4cQmPHs7Vmk5ixqbzrDwUzKZ7bRKCQK2bC0RQobdBYZ0svYFHMV5vDSk8NTUxfeI/UxT2
                    R6H38NMU/EgGDRJbsYIJaVF0Pgic9YbSNEMWSPZZip0hCr4htjsaklSuSjCHBrlJlZo8raEaUWz/
                    HarVFibY+FzzkgnZ0lnHQfRYCnjrFGjJk5PYoBErlvnGwUUs2sECMzRYS4g2xqikTWX7RcgVBuE8
                    nyhrEuEwnSJH7PZucrtrBADsGRR3OeTVlOpZRKI81iUJB1GiWXIZ1eS7xnTsX6iyErzaNhd2M9TT
                    DQxjiFHHamJrAjWK0JJgX319XWgzbBr2mghHdQLO49eCix2NPSM8FS0dpFg2sEE0MTWPKCXEnJfn
                    IWQK6DKEMtROtrIprhZixRGy+G8tkDs5gLyUCV7PWN3KZVXxtNbNgygitbb3imeraIPthj07i/io
                    DL1RcTsUeigShvoYY2yE1RSJMnZtAtZGPlkipTtcgqRjIEcF9fgsOfVD2XFenL6wpglCZm+ycYKJ
                    BiqESSjgLxBEsczXiYjhxRBEcsGy7GdRrCJ3oiyHkawlw8+LcnYl2mI85xKpKdPZBsPwUhirHwHq
                    GA5wgjeGvI4aczCvGWzsh1mYGc8R4ocPVApfsc1HvMR7NPKNYHxGKNbwSa54ahaXYwVswOwjLvIN
                    R5B6J+ThAWe85HLsPlNBd3hFvZYy4B7KNnSjk347WbEPQKzGa5Z7Gs8ymjYUamCCWTB4kJTpTYUO
                    HLKBMqEQVShrPoZ8R85FLKUCFZTtycTGFO4O9i0ns42VBMaxDTOpIJlBiy0jxNDcnDuMp1MVauh1
                    EGWlDqasKUnsyQDKXN82poGUGD1+LuE/Zvlxl+pgzVrttJsMih0DeBPZHvxgP7kxWiSXkCJPFEcq
                    qODtLJKio2morozWdvX8ILrmNu1dPAGh0NNBJkpczZAijMBbzwAtK+mFaQywKIKYSlLGgzQdHKHr
                    yMvX4RDexC/l3K8xdoki10TBCnq5AWJBArq83n9XjQR81ir51PKQi3skWiwwRkEhC5U7yQNWUW0q
                    Z5QzXbF3lhEViaV4SaJcuwbFkbampaUVe9Go11bVhZswYrq1rQwtxU1oiihDwkzotBFBs+enYIkh
                    fEYnFGMdqqVqKjtgXrlq5GZ007Xlr2PHas6sIrbdvRVdeBl5s3YeeqTdi64kVsa9yILfzsWt6JDf
                    Xr0Vm/Fu3VrajJrUKKfyJCPQOhIsjS50UgdNJMhLl78nMq/BlFBtk4I3SMA/yNzeHLjhPEaCWOkp
                    rGnE2Gy2P588h8xWzcfGY1f0vRJAsRbGJVf/HynjjWSTLBFEWZCmCbzWYbObN+rdlmljTOJgZkE3
                    ZWHXY6Q0NjKC3t4DhxBrz8Y5BUWIMfnvEuX5GeySzV7QSLthkMtOSwoVueSLQvIOoTKBXxvJB4mk
                    pxY0y8DFk8+JRNsJSMGIlKfi7nxbTpaZIpRmI5maaMgMgnovNJhYU0ydlko1gCKpkFyKRxLGBhKn
                    l8sUhEGY1WAXuYmI+i1jKFSs+C8mOJIP3RSLSdiMixroibOB0BTpMRN30O8kNiUZmsRn12MZoWVq
                    B5cT1WVTdg84ubceXiJTS1r8fAzVv4w90h7Pvg9/j82gAOnTyPzv3vo+fsJZy/8hU27zuCA++dwM
                    2bd9DfP4C+619JefPuN7Fu26u4cPkaPua2J5kHB7/B0NcP0H9jkPucweDd+7g39BD37z3Eva/Fkw
                    DDn0ODD6Ttzl/ox5Fjn+HLqwPo2vE2Ll78Eq3rd6GlbRsqq1ajtroFdZUrsTi/AovSirA4JQ+lka
                    lQTZ+PFJdpUDtPQfkkT1SR2Sod3FBhOwFLx05E0WgnpMitEa5vRiNrTN+iQABVwN/ABJGUxiCFBa
                    aTcSdT0ibQkDsyqhtrYwOnCRMw3u03zNPgHx6PpNxy5FY0Yfnzu/DlV09f7u4f6algEfNtz164Br
                    eZwbC3nYRxJtZwMzCFL2k+hlqbwF4eR61PIYhyqHWZlAs16bSEYZgATAV1spGgaKG5aiAdlhEcud
                    TRHOpkDgGXrENTSdQHcLtQSlY0fU02/UTpGDsUOLpI9x/ibcchdZwbCknpC4OSkOEXhyXpJajMq8
                    QK9vSlixvQtGIdOjt2YHPXXhw/dgo3+gZw9swFbOl+F8d6P5cKfv3Wvx6JGPz2O/z1b/+HPz75M6
                    7duYfHf/5B6hj9d+5j6OFPX8Q39PAR+u/ek7YR2z75EUWLOrpz/+cfZhNm8eGjP0nRz+A34p20/4
                    8bt+9h11tncOnaLfQP3MU7h0+j9/RFfPjRKXRteg3v0mSePHocTUua0MJyvlC9Ch2LatGWV461ua
                    VYm12K+oQclAQnIY8slRcSjxya0wy/cCnnhSRAHRyHJL8IRPmGIikuHcmqPMQwv7B1B/a+eRC5Na
                    vQtfe3uHj1BjbuP4z+P/z8g/NPBYtIYsee3nN49+ARlGSVQs2LyqRWq5ynIsNmPE2aLaINLBhSmi
                    FKS4EY+gTxoFMSQzLVSB3SpC6WMiKplikl9okjmKJJncny0ciycULG+MmIcSTtMsRNneyOKt9g1I
                    XHojYtE2WZahSlq7GhrQOHeP69rx3CiZOf4sVd7+D85T5c7ruFS9f/la/03caTPw2PbIvGuXz9Dm
                    4PDt8c+19NfQMP/vmu/PsPH+P7H/6KxyzD5b47ePDHx9Ic6C9Yzi+u32S+gUtXruPS5au4zHzxwh
                    W8TkC9934PDn9wAhu2HUDn5v3Y8vIBnDn9GTo37MHZs+ex9eU3caL3U+x64wjaWXdvHz+Lr+4M4f
                    a9b3GOILn19fA9oS8Ghqez/lx6Jlh+nPqu3cTB/e9he/MGdBTXopl0WeobjTjn6Qgf64ZQG1eEWL
                    swOyLK2oly4YwkG3tk87PYyQ2Z4yYjkt9Dn3NBqrs36uKy2Fsa8d7e/WhcVEldX4WdqzuxY81G7N
                    r6Co4e+xinPjmPofvf4Hs2vkC96MmfsiJ/TcNJsN4jguu7J9+j90IfTl3sw7Vbw41++vO+YRD035
                    WmSd5kx+m9cAPfcftH3H7wwU9Z9JekXwQWka4R5b0ff4bTROehA+9jT9ce7N+6F3u37vlR3s3czd
                    +78Srz69u68cb2buxj7mh7HrVVTVjd2ImXNryCg4eOszf9BTt2vYVjH/4ep3rO8djn0dt7AY8pE7
                    +m/730i8Hy4zREGhsc+umikv8u3adfeP3oabx+5CzeOHoOBz74BPup1W999NkvosBf0387AX8HKT
                    CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
                    </br>
                    <h1>Verify your mail</h1>
                    <p>Hello,</p>
                    <p>Please follow this link to verify your email address.</p>
                    <a href="${verifyLink}" target="_blank" style="display: inline-block;cursor:pointer;padding: 16px 25px;font-size: 16px;color: #000000c4;text-decoration: none;border-radius: 6px;background:#2289ffe3;">click here</a>
                    <br/>
                    <br/>
                    <p>Regards<br/>
                    TN College</p>
                </div>
            </body>
            </html>`
          );

          // let config = {
          //   method: 'post',
          //   url: 'https://api.sendgrid.com/v3/mail/send',
          //   headers: {
          //     'Authorization': 'Bearer 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',
          //     'Content-Type': 'application/json'
          //   },
          //   data: emailData
          // };

         return axios(config)
            .then((response) => console.log('axios response'))
            .catch((error) => console.log('axios errrr', error))

        })
        .catch((error) => console.log('axios errrr', error))

        const chatRef = admin.firestore().collection('Chats').doc(res.uid)

        chatRef.set({
          _uniqueID: res.uid,
          name: `${firstname} ${lastname}`,
          email: email
        }).then(res => {
          console.log('success', res)
          return { hasError: false, message: res };
        }).catch((error) => {
          return { hasError: true, message: error };
        });

        if (sendEmail) {
          let config = sendGridConfig(email, 'noreply@tncollege.online', `Account created for ${firstname} ${lastname}`, 
          `
                <html> 
                <body>
                <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
                
                    <h1>Welcome to TN College!                                                </h1><br/>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACQCAYAAAA4CJinAAAAAXNSR0
                    IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAJweSURBVHhe7L0FeF
                    TJFi0c7066O+4eIMEdAgFC3N3d3V2Jh5AQCO7u7u7u7u7uEBxm7l3/rhNgmLkwwzDM3Pv+9/b31d
                    d2+pySVWuvXadOlRj+n/0/+0b7f2D5f/bN9n8lWJ7cuYejazbjxKrNOLlhG3av3YSdm3di85btWL
                    V+M9Zu2IoNG7dh9doN2Lx5Mw5s3Yb99P7JvfsfzvB/p/1fA5bbFy5j17I1WDdjHoak5CK5iyWSWv
                    dEfMc+8GzfHb3adkD7dh3QrkNXtGnTiUvt6bueHTvBo3N3hHTshvLgUCwcMQLrZs7E6f0HPpz5/x
                    77/yVYfv7pJ5w5dBjbVq7C5iXLsH7eQhQGhMO/fQ94m3SAm6YRnGWU4SGuABcZFZjyFaEpLg05GT
                    54ckKIi0lDQkwCQj4PmrI8dJEVwl5OAV4CRYRpaCOhmQmKLO2xceosrJ8zHyvnzseW9Rtx5thJ/P
                    zzzx9y8f8/+/8FWBqfPcP506dx8vBh7N26FYunT0ektS1sDZrBpXlLOOg1g61OM/RR0YapUBFm0n
                    IEEnkEyCjBg6cMd/0WiHZyRVRYOEKjIhEeGknvIxAXGQZf675w0tWl4wQIkOIhTJqPKGkBQsQF8J
                    dVg52iJnpp6aGHSSv42zhiyZQZOLp1Jy4ePo5rp8/ixbPGD7n8P9/+jwVL46MnuHXxMi4eO4FJNX
                    WItbZDcPeesNbTh6mSMropKMJcSwcJ9o7YtXYdDm7djv1btqE8Lg721PjOIkX4yCnCS0kDA+IScf
                    PSJdy+dQu3bt/GnTt3cY/SXXo/bXgDAlu3hJuUNHzFxBEiKY04WXmES4vgJi4HG5EK7Ilp3Lubwq
                    VjF3g0a4swk87I7GWLbDtXTB0wEOePHcPNixfR+PDhh9z/n2n/x4Dl3//+N54+fYr7d+/i9rXrGJ
                    VbjNTeNggyMIGbSBVOsgpwIFdhzpODqUCIiL4W2LxyJc4ePcL996Pdu3UTE6rLEda2NZwFIrhraW
                    PBuLHcb+y4y1eu4uKFi7h88RKuEIAGlxbDRVcLzhIS8Kbkz+MhRKiAAJEy4jp2xqYFi7Bj9RqcIg
                    1zZPsO7Fm5BvUhUQhQ04OHvCrcVNTgZWiE5N59MD4rGw9v3sTjO3fw8snTX+Xr/wT7nwfLv//1b7
                    x68RJ3rt9ESVo2Ih1d4N6yDfpQQ1vJyMKekjtpCi+hPFwp2QiFiOzVC4e3beMa483LV3j66DGeUK
                    9+9uQJ/vWvf+HZw/uYW9sfAYYGsFJVwdxxY7hr/URax7h1e2gpaKAV6ZqWmtpooSCAuUAO7tLS8J
                    KQhIe0DFwIjCm9e+PAuvXc/5i9pjx+bPzbZ89hSHAYojV1EKGiCm8eH+6UPBTkkdm9G0qI7SalZe
                    Hh9Rt4++IFlfFf3P/+1+1/FiysUd+9fYcbl66iJjEbYd37ortACTbUAB4GBrBXVoSdggh9ZKRgwZ
                    eEjZw0zPlSsFdTwfxhwz6dY0ppf7h36AHrFm0RZGGDG5cvc43aeO8ehiYnwUxZCTPHjPx0fGlJBY
                    rSclFTUAYvcyu0JXdmL69E+kREglgKDlIy8NLXx5Lx47j/sHO9ogYfnpGNB+TG3r95w313afduFL
                    Vvjwi+LKJl5RAuL4S3PB+eIlmEq6ohSlMXeT16YXJyKu5euoz3b9/+z4PmfxIsrNEun72AqrQ8eH
                    YyQ08RCUl1Xdjr6GBsTg72zpyGASH+sFRRRE+BJPoIJWGlwIcFNYaLvg5WTZncdB6KTIJ69EU7Er
                    JdKHWSVUJZbCyePX7E/X7q0CF0o4abNnIU9/m3dmjzVgSZ9oIdXwGeEgL4yIhgzxcixrwPLhw9zI
                    HiHTWyhbYOrJTJFaqqY3xMFF49fYLGc2cx3sEBIdI8BPBkySWJKExvhyo/Xwzy9cewwGBEt24NFz
                    VVRFPIPjY+CbfOnOEiuY8M9b9m/1NgYZXE0q4Nm+Bu3BrWfBFc1LUQYmaGyrgY7Jw399Nx62dOhG
                    NrA3RXkoGprCR6ykiit6wMHHW1sXDMaO44BpZQK1sCiSIcRZqw4SkizcoeD0kzMDt++AjaaRti6p
                    gJn679eVo9bxGcW3aAk0ATvjxVOIiRoCW9Mm/kCO7/rGEHhobCTFIC7kpKcOTLIL21CbmXa3hEof
                    t4Et2+BC53TS1UUqR1klzj57Zo9EiEdu0AH2I3H9JCcc2NMDQ6HBcO7ueu/79m/1Ng2bhsFezbd0
                    E7WQG5FlmEkmbYPHXarxqQ2aSKEtg000JLGXF0FsrATMAjYUuvFLHYqKlhwagmpmBg8aAopTNFL5
                    5KWnDiKSC2iynuk8hkdujgQWirqGPymIlcw88dNwNtjFpBjXSGvpYWdCkPLcWlYU8gY2Cxl5CDA2
                    mclR+Yi/1nSHAonOUE8FJUgiuBxY/SgC5dMbK7GbLVtBGsqoHVU6b8Kv8fjX0+vHYl8ky7IVIkjy
                    DSQ648aUR0aIMtixd8OOp/x/4nwLJp1SrkhkfC0aQVeomU0ENagF48AVZMnvrJj7OGmdOvHAUUjr
                    qpaSKgeTP4UE+0Iu3SS0oSfSWlYCnFg4OiKmYPauD+w9xZiqs72hKI7IkRnOUVkGNrg0cfmOUouR
                    IjYqJxY8ZwDffm9WtokAiVERODSFwc6vTahpKznBwxhBwcxSWIoeSxeExT9MTyVOPhC3eBKoK1DO
                    CvrIYMIxPUtuuCUg1DJFKEtnXKr8swJiMDFb6+mJSby31m1923dAkSTFoiQEoO0TIK8JeTh59xM5
                    REhmLLkkXcf/8X7L8KFlZR8yZMgHfPbjDXVoOZUJbYQQrmknxYClWxcdFS7jhWqTvmLYStqjYSOn
                    bHnJQsPH/0CFvGTURUi1awl5aFA/3HSoz0CwnQpD59cW7vXu78b0lwFoeFIrhTOxS7O+Hu1Svc93
                    dv30JKTCS01JQJLE1ui0VDKuqKkJESgwpPDMZ8MXSXEYObQJqYRQpuYgQWaT6BcTB3/M8//YxhsQ
                    nkhvgwJwEcZNgcdy5e5ETurgmTUUau9MyGDdyxTMDOr6qAL2mbKB1duCopYuGwQXj/7h3HgEtHjo
                    a3uBzipJUQr6AOb3UV2FJewrt3xryGBhxZt4UD/3/T/itgYZV8Yt0OzKtpgL+hMaxFcrBWFcBJSx
                    n21LPZ0HpfviJyPANx/dxFrnGfP36MibW1ePH0Gd6/esV9d2jWfCQbtqIohcJnMT5pCmn0JcA4KK
                    ugJiICt86d4Y57/fIlnj99ilfPn3O9/On9+xhbWYXOevrQVlTEmJEj8dPPP2HawrmQVpaBuFAMPE
                    kx6EuLwYwA40juzkdCHN7EMg7EOAmWvXHy0D7u3C+fPcOovByURoThztWr3Pnf0vnnpWWgf+9euL
                    p/L1fmV42NiDYyRLCMAEnKmvAk0Ts8MQrviM2Y7aSOEUQMFSopIGCSINZUgl9zXdjJ8RGoa4gie0
                    86ZhXXcf5b9o+DhUUPK6fNRVJHS/gKteAnr4p6VxdcPHoEa8aNxABvLwQbGMNcWh62KvpYOXUW9z
                    +u0QkkzE7s24f1c+aizM4F4Ypa8JUScWBxpR7uSCxjRb3fU08PAxNicPbIQe6/zB7ev4P9O7ZiUE
                    EBbKnXG9CxqjKysO1rg+qBdTDq0hZiAnGIicQgSWDRpWRKLONMKZhC9AByd04SYrBT4SMr0BVXzp
                    7gzs1A2PjkyafrXKYoqrxbDwywtcat40e57xioPEiLxfKVyT2pIoDE+/jURLx70wSWXQSWEGIUP2
                    KoqBZGWDh4AK6dOoFh7p4IkKfv1YxIy/TGssmzuDr8b9g/Bpb3b9/hyrFTmDtqHBwNTGBDFRBu0h
                    aXjxzFUxKcrKLfvXqJx7duYlZNHeyo4kwl5VAQHI4HHzQGO+bYnj2Is7SCq7YeQvSao6y3JSrMrR
                    BGn+0lpMgdScNBQhruVOkh+gZIszDHxgXzsW7pUuQnRcOuc3t0VFVFC9JE2hI8KEjIQE5GCHHqzW
                    IUTckoykGMGEUkLQ4jAkZXcTG4yEgjkAS0H0U9XgQcd6E43DQE6OftgIPr1uDygf24few4ru/dj9
                    Or1mF2WByy1PQw1MYe906e4PL+8lkjfJQ0EEhuJlRKGaHKOrh64gTnWl7df4DpKZnwlhUi0qQFlo
                    1owOvnjVx5H128hIyW3UgXUTQn1IAjCfA54yfi/Kkz3DjUP2n/CFjev36DQyvWIc/aFdZK6uhOYW
                    JoD1OcoWiEVcjDu3dw4fQZXGf3Z4jKF5L/DmrXAb0VFGCpr4uFU5uiD0bxZeHhCOncBVsWLcbpPX
                    tx89Qp3D59GlNKS2BJrsKORKgHASCIJ49QOUW4E8tYUGO34UvDSFYKetISxBiSMOQLoEO9WyTJA0
                    9aDhIyfEr0XiSANLkabT4PLeh8XcQlYUe/eZPA9ZWWJsCI0bklECQjAT+eJMJI8+R1aIfqHmbo36
                    o9KhS0US2rgQK+Kmo6dMWlXbu4vL99+Qr17v4I1zSmxjfFMJ9w/Pz+PffbmaUrUNyiDUI01DCzpp
                    KA9YT7ntm/fv4XSizdKCJTRV8Sv93khOiqroZwO2dsI2C+pbr9p+xvBwsTdgdWrEZuLxt4K6rDma
                    ISK0V5DM5K54Dy7NFjFMXGw6ldV4SY2yE/KAxLJ03C3vXrMLK8BGZ6GihLiKeeRnqDjj976CCObt
                    /+Sey9efGCE63T6mpgSYBwlJGBD7FGiIwI4aR7PMnN2BA4u4v4MJGVhgE1sBa5E22KcNQFQvCJiS
                    QpPJYkUEmxROAQiktBl85hRO87SfGpkQRwYTcdeXLwIZEbRr8nksuLJSaLE8rDn0AVSCmZxHUVhe
                    eDSXtUyVNkRGHz/MpKTq8wEXv3xGkcWLkOp7bsxP0zFwj8pHmePMWivCLkEkvOKirEk/v3uHJ9NG
                    5gsaMZehJQgtp0gG/nduioLEQnkQgRva2wY/lqro7/CftbwfLT+3c4sGYVCh3syeeqk0ZRgJdQEV
                    Fdu+EcNTpr/FFlVWgtVEdrcUU46LfD2Oo6NJIYZfbs6RMMLMyBh4kJ1k6cyH330ZhobaSIaOGgeo
                    S0akGMJURfciP2fD586DrB1Li+xBw2BJ4ukuJoKyOJ5hTRaEpJQFlaCkokHIWyfPAJSEKBCAI5EY
                    R0vJDApURMo0NhbzO+PNrJKqInuUwbRU0KoZXgSQI0TFyIRDER4klYJ8kpI5xAEs2TRqZADqU8Pu
                    pFiuivpIIEOVliEjXMHVDF5fXdB83FjAlbJtqn5RQgSbsZanr0xd0zZz/82mSsfm5cu4YOmjoY17
                    8WB9avx571qzBr7EjEWlnCiVg6rY81di5bgZ8oqvq77W8Dy0/v3uPg8qUosbdAiI4aAlWU4C9Sgi
                    v1+MrAUI6CWWXkRsejGTVsJxlVLGoYy1UiU/wfJxE9ocgivGNHlAcF4S1VNqtwxiZTqBcmd+oCT0
                    UVOJKvt6ZG6ishCRspHvl3NlFJiahbgG7EIiYUjhvyZaEtUoCOigpatmiBVm3awLhNW7Tv0h29+l
                    jCrJclunXvhW5dzdC1ixl6de8D2x5WcOhqDufOfRDYw4bcnzn8jNojUK0FwoR6iJDVRCS5m3DSPJ
                    F0/WQCX39FJQxRVEYJfU4jgMYqyZG2UkNat45Y2b8/x5CvKf/zaquR3ccC/hp6SGvVGTuGj8E70j
                    WMMT+WnQlZf3cXDKsfyNXV57aVBH6ggio8hcpI6N4T2xcs4sLwv9P+FrCwwi5sGImMdm2RpqOCFK
                    qsSG1NeCuowEZCBB+D1tizaAVXAdPHTUA7HV10Fqng1pWrxEbvsZnEKLtvw+wFRRklLk4UQgpQZW
                    mNQdb2SGWTlZS0SHQqIkSgjgCBGrxklOAmowgXnjKBRwVWxAK9iMV6qqqjh1EL9Olhjtj4VOQUlq
                    Fu6CiMmzYL0+YtwqxFyzGH8jJv6SrMWbwCC1dvwAJKc5auxmLSWWtWbcGaxeuxeNpizJkwG1OHT8
                    Co8noMTe2HgYFJVK72CCadEixQRKK8EvIp4qkmPTSAwFlGzJKmIEeNKgNPkTSClBURpKpM0Z42rE
                    UysCUW9FDRxPySarwmoDBNdo1028lDh7mys3GfxfNmcO8/NwaoTSRyo6jOQoj9fKljBJPwnV03hH
                    Nbf5f9cLAwAEyqHoQg43bwosqIVOBjYWIkNlaWIoN6QC8xIYW17bBp+i/D2TmJ8eihpcG5Gyd9Qw
                    R27Y5zR49x53p06zZiW7WGCzFGMLkGHzEpeItJk06g84jLw1FMAHtyCbYS8rCUVIAF9XQnbWNEmt
                    ujMjEDQ0srMaC0P2YtIN/+g8coWMMsqBuLeSW1GB6ThLze5kjS1EUagTSXXFsKCWY/MTGK0lhEJY
                    ZA0lRxSgoIoPfhKkICNg+J7bvgKUVDrKwHd+5BYWwKrp6/8OEKTfXJ0kdj7/fOXoBkw5YI5gsRLq
                    cAf2kRd9/KXd0QM/oP/tXxP9J+KFhYJldMnYEY077oS9GDnTwfo2IC0Xj3Nh7duIFCD08Yi1GEwV
                    dAWWTSh381/W9YWQHcWjdHkmVf3Kbexb57/vAhxobHUAQihyAJEpfSAtgRWCwpgulE52lBDWFAyZ
                    Ded1fShH83S+QExmJIcQ12btjOnYOlpSs2cWzH3v9o+3gNlvbv2Inh+YWo8A9Eao8eCNDRgqOQh7
                    4UQTlISCBGII9c0jL9lBWQIicFVwJRVMuW3CDhFRK/WX4h2LZuw6/yyd7vXTL703c7psxEpkknBM
                    qrIliN3JtJS2Qat4WvSBVeqvoIbd8Ti0ZP/tU5fpT9MLAwCt09bzFS+tjAS0UbnsqaGJeQiEZS9w
                    9vXMfQzExYaOuhF4myXgrqcDBojrn1gz4VilEr66ksse+e3bmHCUmZCFTWhq+YDLxJj7DZaY4UfX
                    Sg90YU3hrLK8C0uTH8KYwsSc3DxCHjMWfqQhzYd/RXlcXe/17lvXv7GusWjMf6+WNwaN1cbJ8zBm
                    vHD8KBhTMo0vj20JRdgysHpQsnTmFQdi6iLS3hoK0FO54slYF0DLnHWlU1pFP0FCArDksS28Ht28
                    HFqBmi+1rjwtHjH85GkSS55Mm1Az7lf+/SRcjt1hNx6rpIatUGZ/bs5urrxd17mJuUATtZZZjzVR
                    DYpTdWTZvH5eNH2g8BC8vw8SVrUGBqQ/TYBm7SsliQmI6XDx7iwZWbGF3cH30NycWQUF23YC43lm
                    JHUUIE9apFVVUc0D63B5evYEJkAmKU9BAgJYI/RSnuMnz4kZi1pd7ZknppFwNdeLs5I7+wEMNHjM
                    Gli5c5H89uJfxRJT29dgOn587D4QmjsWPEAKxryMPcYl/ML/fDogo/zMt0xIxYS0wPt8TC3DCsGp
                    CNPVMbcHLpLDy5fvXDWX7fWJmY/rpB+RpbUIEylwCEa7VErFADOSS8C0Sy8JeUgCtPDB6kX2wopA
                    9t3Rqndu/mhPyqidMwa8ToX4nWUfHxiNfSQmZLY1w6eOBTORmQXhILT8vIIxdvAjs1I7i36o61s5
                    dw9fGj7IeA5d3rNygzs0K6qiFy1Q2wMDwCr+7dx70L11CfWYE+hh3hR9HG1hUruQpkM8tcNVXgRN
                    GDh7IyRmfnUeVMxApK02sGoMLFAwlK2ogmPRIqIYALhbJWPDnSIwK4NzdBhKMjinNzcPPmDbym6O
                    kNRQ3f0otunT+NvfNmYnlOKuZ5OWC5vx02JbtjZ7k/ttf6YkWpHaandsLKPHPsLnPBpnRrrIrtg5
                    Wx5lSm3pjhZ441Bak4v3IJnl66+OGsv28MNGzg7OHNO5ieXY1BLoHINTRGvIIQoRTuu1HE5EyhvZ
                    24GJyFBCIXFwyKT0JSd3MsH9I01YKBYef0OYg2aIHSHma4duwo10GZPX38CFtXLcftixfwjOq80j
                    8EVrLq6EvJv4MZti9fw9X5j7C/DBZ2h3XN0AZkKSuhH/X6Ki1tHOxfhn9RBtkQ/5xJMxHtHYwtq9
                    ZwvYT1mhkVFXAjoRfVygQVXp5w1tVFQMs28NIx4ELBUBKycQSQeBKyoRKysKVwuy+5NvdO3VCclI
                    Z7d+6gsbFpOPyPjB3z5NJlnN2wFrOTQzDKuh1mOXbAujAr7Mv1w4nBMTg0JhKra52wuNwKM3O6Yk
                    F+d+ys98Cx4ZE43hCNA5X+2JJhixWB3bDc0xTLfa2wKDEEVw/u+XCVPzaWj9eNL/CU3OvM4jIkkq
                    bx0taBo5wIjuSenMWl4SQpRWG/HLxEQtSHhOLN8xfc/04uWY40447IN7XA9RMnPwHlPrn4mn5F8D
                    LribULFnDH3r9+HcGGreAgJY/eVIfJFD2+ePaMO/6v2l8CC2v8/YsXIk9HDZUiHvpLSqKSQsVhDn
                    1weV+TP3354iXu3r7DjRm8efkSSxuGIkhJDbkWFrh14Tye3LmNJCcHOKtpwZVPoSWlaJ48oiWkEU
                    HaJJR0Smirrkj1CEZD/4FUQfe/CSTM2HE3Tp3GzMQkDO3VGWO7G2KulSE2hXTDiTJ/PNyxGHdPbM
                    aKQZ6YWWGF9SP9sW6IF0antsGE9M5YUxuAA6NTcWhoLA7XBGBvqiW2+LbHMjtjDOuojtmx3rhx+i
                    guE2P9mTw9f/IENy9fxtDsQoS0M4WtHLlXEvDO0mxitwx8ySWV9+mJEyuX48q6taggNq3vZY3rxw
                    gonzHoq1cvMWXUKHSnDjprbNOkc1bnQ3wCiK14cJUTUoSkifWzZv+Qm4/fDRY26HZs/UaUdO1CjC
                    KLoXIyqKfIpFaWh3iBDGocbXB5//5Pt9TZkPTmefPhTgK31MEF16kRWcU9uH4NsX17wU2ggAh5DU
                    QJVBEiJaAwWYgIDU2kdTVDQ0IOlkyaiwf3v/25G0b/l06dQrWnN/Jbt0RDGwPMNTfBzoheOF7shv
                    Mj4nF27RTsXDmZNIUlVowMxt7paVg/PAzjs3qgIbodagI7YGqmGy7vIprfOg0nqr2xPaIzltjpYW
                    IPTUx2N8WweG/E+zvj5PFjf1pQPr73gATsMIT3toODlhG5WSEcCCyBcnzE8CWRLsfDKMp7tZ4B7h
                    z+RbQ/uncPd5hGI+Z+QQy7b9t23KFokxkDy7DAQHLxctxdbieeEFHtumDPyrV/edDuu8HCHmOos/
                    dAGrmMwZTGSFGYTGHtCBKjmWKSiCJ6rbJ14vwoM+Z+NpGoHByfjItHmgrOgFLi4QwboRzcxKUQKy
                    LRK1SDN0UMwYbNkefohoXDxuD6mQt4dPfbgcIa7cyJY0hxtkeEoR5KTJphQncTLHftgqOFHjg3Mg
                    r7R8ZhdIo1stybY/7wFDy4ehh3z+zC+hEJuHJ4AxZXBSHLUh+5di1xctcaNN45jzubJ2FfniWW+x
                    hjpl0zjLBtTdFfS/RuroFgT3ecogjozwLmIQHm2P7DGFRUDlsKAiwp2vMVCBAtw0OqlDR1RAGGGb
                    fCKwLDOxKxD69cxfDUDJTaOOHM+k34+TMAsA5yldwUeyjOhiJFZ+pwTpLELvJaSLNwwsGtO0m/fP
                    9Y03eBhbHKvqUrkE3Ku0qkjgkCdYwX42MSCdLRkgooFZNFsqQc/GUUsJuOe/H0KYd4xi6NBB4GlE
                    e3bqLYzoqiG4oESNy5EysFSsnCR6iCgOatMCy3EPs3b8PTh48/XPXbjI2nnDxxAk49u8JJTx0Zzf
                    VR39YIk8wMsSG8B64uG4HLq2qxdIAHKoklqqK7Y/vioXj35iVV9s84OLcMb18+wcaRaRgYaIp0cl
                    v9Y01x/9Z5vH/xGJcX12FjQjfMcjFBUTtFyqsC7Ey0YNO5I+x7W+PEdz7vzJ6AHFJeDVfjNtxtij
                    BKGcQ0OQSYcnlFrHF1x7qgYBSatEQQfQ4QKqCiV18cXUb1+/gxd0PyGrF1eKv2MFNRglfbVphTW4
                    8cdgNXXhfuikbI94rE9YtXPlzxz9ufBgtr9P2r1iKlZTtkKKhioII6RkiICCxCSiJM4mmiSlyITE
                    kRYinu96JU4OyOc4cOcf9lQHlMGqbS3Q12bIKzIkU4UuJwJ8C4UXjsqWuABgLKw7u/vvv6LcZ69f
                    GTJ9C7tym6aCoiuJk2atuboKGlJmZa6mFHuhnePX+Eexe3YkJRT1REtsOYfAesHJtOFb2T65mHFp
                    bj2r4FmFHkginpTujn1Rpp3rq4fvkYd42X969heXxnTHZuhn4dVRBqogxrfSW0I4HfXFEDZu3JzR
                    39tbb4Vnv04CGGE2C8mrXmhvDjiKVTSbeVEksXyQmIaSQQT9FTGKVAnjTcpKQQpKmJUksrDHByRW
                    zL9nAnRh5dXYm182ZzeTi1fRdyeznATVoLAbpdsHPZeq4dvsf+NFguHDyCfEtbRKiqoFBHAwP1dD
                    CYBGuDtDKGSqhgqLQaSsTlkEVgCaNXdykRLBVUEOfkiMO7tuMe0Wmlrx/syJ+6SkvBjcJGVwKLEx
                    XeQ18X9VnZuHPz1if//K3Gjj92+hQ6mZtBW00Eh1b6iDPWQ42JAca218NMa11sSunKgeXmqfVE5e
                    1RGtQGIzPssG/1ZA4oLJ3f0xRVrBtfgPFpzshxNkaWnxFuXj3JXefl/etYldwD09xaoryrJkJbqs
                    BCWwHtFeXRUlkDWgI1mHY2x/Hjp/50GZg9ffQEI4rKEEAuKYDce6K0AHnkToopSsqhOkqTlSI9I4
                    5AGepgMmyylyTspHhwkVdBcJsOWDJ2/IczNXUeloeDK9cjsV1vOEprI7OXB07u2M+V9c/anwILu/
                    DGGXMQqKKKCBUhJnhY4/6MsThVW4XBpmYoEmqgXKCFMllVZFHoFiWtCB8SrKkWNohztIdFC0NY6m
                    jBgj06QRTLHr4K4Muit4QEAju1w6DCHDxvfIYbdx/gHlXan7GL167DLiAQ8pqqaNtCF9aGmvAj0F
                    Qb6WFkaz3MsDbEwWI7ciVP8PjSPszIsUWVdyeMjnfB/MoE3Dy6/cOZmsq5YWo1phWGoTbcCkNSLH
                    D/5nnut1f3b2BVbE+MsjRCQXt1RLSn8NdEB910tdBaQwfGGgZQU9CEk1cQzpAI/R7AsEdhZ9U2cJ
                    PT/aTkkCZQRLq0NOLJVSdIiyGCLwZvnhgcCTj2crLwJjYu8PDE1sWLP5yhqQxr5s35NMayesZseC
                    gbIkinHUoCo3CaXPWftT8FlkOrNyOxdRduimGRiTZOr1rMZYqlf1HUM93LF5mqesiWU0U2VViQjC
                    LiTTqQQD3LhcjVYcHoLiUJF5GIe7jcj3qEK3t8g1hqUF423rxumoj9Mf0Z27prNwR6upDXVkVzXV
                    X00lZBiJ42CnR0MaK1ESb21seeTGu8f940V/bG8X1o8OmF0VGuFO38cj+Gve5dOgozquNQFWKLLP
                    uOJITt8eT2Ze53BpY10X0wyrw50k1U4W2sAfNmmuhIYGlB0ZuBijZ0VHQgr6wJl+BIXLjWFKX8GW
                    N5ePfmLTeh3ZGJfQJLAoXBsRJiSJSTRIQsaTwCixWBxUFDDevnzOH+83kZ+qWnoQOx/isKLJgd2b
                    oVMW27cHflYzqZYsea1dz3f8b+FFjmN4yCD2U+TkSUqMrH6D4dcXPzWu43lkHmCw8MG4bhVraIUd
                    JAhL4xbpw7z/3GRhiTe3ZHXwmiT9IqISJ5eFAEZU8VUegfzE1m+ljYP2s79x1A2559IKuuCmUDTW
                    iqiNBJWZ56nA6StPRR28oEY7vpY2NQN9wfl43H8/pjVaY3auw64+DyhXj59DGmV+dj+eSRXB6q4t
                    2Q59sDJQHWyLbvhOGRFnh84yJ+fnQHV4fnUDTUE4O6GCK+mSrsjdRhrC5CCwKLHukHXRVN6KvrQl
                    lVC4btOmH91l8Y688Yy8fbV69RF50CB2JnJ4oWk9XUEM2XRoScNJykJZDRtzcuHDrwxXpjLsjTwh
                    yhjrZceM2O2bt8BQKU1eFKAjnTyQHnDjZNA/lW+2aw7Fm5EUldLBAoJ09hnTTyBDzUUSWN6tYBGy
                    tKcX83CUTKEGMYFv/PLirG5LQMTqk/u30b41OSKZMC2EmKcQX1EAngR72+yDMAUwaN5O7rfI9dvH
                    oTPuHxkNPUhYg0j4qeJvS01dGRepylqjoSWrRDPxOKrtrpYoNnN1wp8ML1qjDMDzLHINeeWFFXiL
                    0LJ2HHwsmUh6YJWZvGlWHpwFQsGZCJ/oHWmJrqRqHzFQpfL2Jvsgdm23RGZUs9xDTTgkObZtBQlI
                    WiohD6BvrQVFYlwGhAT0cfqtp68A2LxvnL33Y/6bfG8sJWgRgYnwFXNV34iVRI3MoRs5AWpJRPrv
                    3muabZda/puFEUfk+ubXqmidmg/Fz0ovoYUV6Al88bcWHvHuR27AAfYnZfHR0s+/Cw3LfaN4Hlzs
                    VrSHfygxOp/QDKZAq5oWpZYhbSHsNIqQ9gj4Ba2ePEkiWfUM4ecWA9gwmpU9u2IVpXH64kxpxkJO
                    CkIAcnLXXkeHli+pAxVJDvZ5WFy9fAsH1XiLR1oURgUdRQhrqKAporKKCHmgb8m7VDIkUI9a10Ma
                    2rLnYH98KZIj9szPLGpFhXHFgxB+8prz+9f0t5+Beu7F6L969f0nevCETjMCUvCLfOHkHj9TM4Na
                    k/lnqZY4xpW1S2a8U9CNZOXRl6uhqQp1c1LQ3oqqlDnzSdDrlWVVVVNKOocc6CJR9y++eN1QsDQk
                    1sOlyV9RAu0ECkrBLcSPM5k9s9sHULd9yLJ88Q36UvfJt3wLIp05uA9vo1+kWFUzhugBFZKRgSFo
                    QobU0ECAQIUFJGrgO54FNNWuxb7JvAMmfoWDjpGcOB6QwZGSST7qiRksE4KQGm8JUwgqeCStIp1R
                    27YtuMGbh57Min0PHulSuUyXD4ywjgTf+xI6D1VSEtQzQ4bcRIvPhw/+N77OadewiLS4M8uRpFcg
                    EqWmpQVVeCNoGlmZIiOhKIu4nUEGJgjH4kdEe00cF82zbYluyMtflBmJ4dhLVT6vH0QdOzz//618
                    9Y2z8Jtw9uwp1j27FhVClm9gvHniXjsH/OQCxLc8XwPm1QTCF5jnELuGlpoxmFzLqGelDS1YSShg
                    p0CSAmxGp65AaVRHyoEXii4pJw7eZt7hrfY6x+nj99hmK/CPjL68JHUp4iGzn0JnFbFBbK3Tpg9X
                    3xyHH4a7WEv3EHnNy0hfvfuOJCWCmI4KgkhJ8mRUyUxxDKM3tENkC3BaYNbFpu5Fvsd8HCLnbvxi
                    0k2LvCWV0bfkpKCJeVJbBIoZQafgiBZRSFxiOlFFArrYRsWWUkaeujv4cbjm5cj2tHj2BydiYiqd
                    FCJeXgTcmSMunYph2mjBqNZ0//2upHs+YvQ4u23aCgqgl1aiBNdUW0bq4LF4ueCCZfbdexI5rxBX
                    DUMUKCrhHyiXlqujTDMJeuqHLrSXrAg6KOLGxZOAYvHt0lFvwZOxpycWxcEVZVRGNOUQzGZgajOs
                    ICVaGmqPHqgn49jJHaXAchWlpwIrY00dYmkKhBRYfyQGDVU6IQWkUeBop8GJPQtujTA/GJKdi+e/
                    +HXH+/Pbh9B4XO/nBkYJERwpLHg5W8CMNT07j1Zt6TKB7kHkgiVhH9uvXFtllzkNy7F2wIVBYykk
                    g17YzNUydj0+TJCFJi2kUTSY5+uE2u/Fva4Q/BMnFAA1VKM4pgFOBPsX6YHA+R0lJIJbBU8AQYSJ
                    lukGTuSA2lsioob9YKB1avwWxC9AAnWyRQRBIhI4toaXl4SivAVtsI9f0q8ehh0xop32tPnj5HQl
                    o+NHWbQ520iS4xSs/2Jhg6oAJ7tm3GoOJshDjZwVBBHj1JOwQYtEaolgES2zaHP0Vy3u0MURXtj2
                    WjqrBydCmOrJqKx9fO4/i0WhwcX4wJyW6YlheNmWWpSPPqDrcuyvDuqIqwDloIMdbm1lXpra4JI2
                    I0RRVlKKoqQ4fC9ubUg7voKMO+ayuMHzEIq1YsQU3/SsxftARPnz3/kPvvtwXDx8NVwwg2PDnY86
                    RJA4ojSt8Au2fP5lz+jSPHEEEgYBPJA+QUYS8pBUc+H+akM6v9fUioX8eD69cR37oTrNjKEDptSe
                    vU/TWwsD8/ffwU8dau8FTXgY+iAmaXl2JSWgJyOrdGgoYqciiiqaZopp4YY6icCioEylgfGMZFRY
                    dnzkZRWxNEkJiNl+QhnljHR0EXQb3tsW3jjg9X+X6bvWg1WnfqDQ0NXdIJqjDWVMKAfrl4+ughF4
                    IPLkpHqJsNuQMBWpM+stBvAVsSnXZGWuhtpIah5YXYuXw+Nk4aiJ3zR+P+pZO4fWo/to8vwJqGeE
                    zK9cCC6lRc2L8VkwbnwbWPDmw7EwjaKsNcW4A+akroQtGJjrIKNDU0oKwoj3ZGurDv2BIxjn0wIC
                    sSe7euxp6dm5GSEIHw8HDMXbDsQ+6/3+7fvIPi8GiYC4VwYM9g8yQQIhRgfFwcnty8gQcXLyJeQx
                    /hJA98qV3cJGQozJYjZuEhxdoK10kQMy25ZPR4mMqqobeiAcJ7u5IrfvyHgPkqWJgPnDx4PKzlNe
                    BFIja+mS6ePbiPV08e4tTWddg6YzLmZmZgoFFzVJNrqZFTQLmmDhp37uYuemr6LAxs0xJZsjLIJF
                    cQL6Swr1V3jKwcjNu3/vpK1TX1I6GlZwItco/61LN7Guthz9YNXL5vXbmA8qRQBLlYkH6RI7EpRH
                    NVBXTSVYF5Bz001OTjyeMHaHxwG0vqyQ3NGkoRHBvj+RfO7FuFs/tXEuMkYdmQdKrYFzi2fx0KUy
                    0wpDYJIwYVwMG0OdpSBNSWRKw+aRJdDU10NG6OYCdr1CSGYWp5BqYPzEVNbgTCfKxg1qUljJsZoq
                    6+aSmQv2prly+DBwlsR4EURads3EUG8WrKqOxrhhFe7vARiBAoVISXlCw8pGXhQsmVpEC0eR9uQU
                    Zm7NZCH4OW6MpXg7mSEbFL7Sed+TX7XbAURyfBgY22SoshXEMJl48c4R5F/ThU/Pb5c+wbOwZLMz
                    JQ2bolRpNWYUBhd0IXJiajhFxAObmuLFLu8eqkyJNySYz9+UGq39q79+8Rn5YDVWIVbWosLbqGR6
                    8OOHf0AF48e4xR/eKRFeoLXwdbGJD619Wg6EhTCt42LTBn6gA8vHsNb1+/wKWDOzEl3RMz8lxwas
                    0o/PSOoiKW3r/GwrHJmFEZhPs3LmDXmikYWuyIKxcO4i1FSYtnj0Xv1gbQkeXBmEJQ07btkBYWiF
                    ElWZhfm4/Vw4oxpiAcUU5d6Dh1NFMXwoAiperqAR9K8Nfs7t07GFyYB18DLQQIeYiWk0EoMYyvrD
                    gCiUndZKTgQR00WEUT0YbGqA4OwdSa/tixbCnVT9MDfGzt4DgPP3SSEqKPUB2xTj7fBxbW4Czs8u
                    7WlUSQBEKVxOBOlBdrZIzpERm4f+oiN0/lI22xIeWVoxu4CcXsu+Mjh2Fgs2boTzqnQlYeqUIV5H
                    Yzx4kd3z6z7Pds2qIVMO7YmSIfTWIOFU5MRrmZ4dyxnbh9/QLivXvBuYcZPKw8YGzQFop8Sbj1Uc
                    XGBaV4/+4VLh/dhBERvTDQpQOmxPbF4jJHLKt1x96JqdgzMxNb56VhZoMPppV5YkhsHwyLM8XEfC
                    vcvHiQu/67N28wfcwQdCS342ppgbrCQkwfVIlFQ0oxvzoF28b2w+S8YIT2NIJtKw1YdTBBK319xE
                    TH46cfNCf26tlzFB35w4NcUDABJVJI7kieOrUqH0EKQsQZNsfwqASsGjqSm/bKjOvIP//EgYJNhp
                    ozZiwJZEX0Ie1p3bItXrOhjg9t+iX7IljYANnoikHcYxs+KuIIVRZDgCr5P4ECnCQ1EKtvhgnRmb
                    hxtGleyucXYO+nhASjn6IShdMK6CdQQZZhK4yITcOtC99/e/xzqxk+BlrNDaGiStEH6YZWmgpIDb
                    TBgtFZGF7ihRCHdghxdIWfQwBaGrWHqqwUatN7UwU13U44v2cpxkezh9M7YU6mDXZNCMeG0cE4tr
                    AKx1fUYfeKciydEIV5AwJQHdgBQ6I7Yc2QIDy7c/ZTeV+9fIGKgnSMHTQAA/KyEOdmi8GpodgzfR
                    BOzW/A/KIQ1ASZox/lK83PCe4WfdGqeVv0Kx/4oRR/3Y7v2otgciXBFKFG8AkssmIIU+ZjpKcLjk
                    +a8skDfMwzW69mSlkRDm9vWvaVjZqHkPvsKiaGlnw51FfV/e7g6BfB8v7dexS4xZIL0iRRKkviVg
                    x9yRVZCQSwlCaaE6hzy0dEtTTAuAhfHF86j/sfy8CWinpkquiT61FCDl8BSQSW0t7WuHbiJPf7j7
                    D0onKo6utAicSlurwCgUWRwGLLgWVmQzRKEpwQ7e6KCHc/KPN56NtODVOKrPCewHL1wHxsHeWHVX
                    X+GJNqjQFxXTCu3AJ71jQ9nPUxHdkwHMuGxlBYaoUZpS5YPSoCD26cxMvGJ1gxZzjmTR6MwaR9gj
                    wc0MFIG2bN9TAoJRJvXr3EozMHsKAoABNTHTApzw9VCd6I8/dAt45mSE4r/lCKv27XzlxClrkHPM
                    SFiJBiiwGQhlFWwpGpE39V11e3bsNod29uWMNTioe8Pn1w7fBB7lHh/s6OsCawdZIVINozAO9+Zz
                    bdF8HCbmL5GXSHlTiPxJEMXInmg9s0R5GnG+YVl2BBTiEGunsiiUJVHxKPsS2MMCEkAvsqhmBINx
                    vEUKicRNQWIcFHhIoWhkXFU7j217XKR/MMDYeQjZiqa0CPUjMVCuutumBybSJWTcnHyJJwxLrbEM
                    NYQ1tODL7meqRRXuLajimYW2iGh9dPc73uwa0LmDMiBuPqvTFtZBjWzK7Cxjl1WDImH6vGZ1Jlvs
                    CFfauxgsTug5tncf/2FcwdW47BZYmID3WCde92MNCUh7G2KizbGCPb2xmvXjzHw9P7sLDQF5NSbC
                    mq8kJxmD38bfrArHNvuLmHfSjFXzcGiLP7DiNY1YQ0ixq3coQXdegxcdFYPWIECe0KFLv7IF7XBG
                    kiLZQq6yOTJEESBQWjAgKxpF8x4lsao7e4OBw0dGDfqjNmT1/IPa/0JfsPsDBWWTh+Gix4CrAhN2
                    QvJcHNaGNLiLMn9bmH1imx92zm241z5xCqa4hYZR1UabREiUgHmbJ8hEpIwJH+n9itJy4ePf4rpP
                    9Vs3R1g4BCVw2KvvSpkHpsHZd2zVCd5oczB9fh6cN7qEuPQHddEbroiaMuxRqX147EweHhmJHSA2
                    tGZuH547tcnh7eu4q5U/IwZ3IBpo3Ix8JxlQSUyqaZc/Q7G9U9vH0Zlk4mTTKpEv2zA5Ab74HYIE
                    cYaclDV1UePdu3hk/fHoi06o4Xjc9w58QujEuwQ66tEZKtWsC/ZwvKnzFM23dGRwr3t+1pejT3R9
                    jdazeQaekKR0khtyZNMEkFXxU1BOgZwVFZDX6KOkhWMEShwAD9ZLSRLaGKZGk1ZGi1RFEHU8QYNU
                    MfckO2coroKdJARWYJ6dUvP1j3H2BhS3GVRqfASV4e7kThmabd8eRuU8V+yVgPvXX+AtJ0TFAp0k
                    OJuIDcjwwCJMVhTf+vCI/C4x+8qZO5kyvkNdWgpqkNLVUt6CqqoFer5iiI8aSIqOmG5oPbN2DfVh
                    V27XlYMTwKe0dEYGWeDSbH98LkbA/sWDyei5xePn+KRbNrsWn9TGroJ1g6exTHQuwc965cxIldmz
                    F3VAUB0QM5ERaozPDGrNFlGFCUQlGOArRFcmhOwPXu0wVDsyKxbcEELGvIQ5lXV4R10YB7WzXYt9
                    Gj/DVDC20dGJJ+Gzl5/g8DyxMKgfvHJsOGL0IINXi0QAlekrIUkAhhJylHbaiCQAJHpnILlOt1RF
                    2rXpho6YUDo6fhFUVEj27eRKWNDVxINtjL6yDXP5b02C9Lg3xu/wEWdq8mwsoR9hSOhmprcxsTsI
                    LdvHQZa+bO5dZ03Th5Eg7OmYvnN5ruqfzElHV4DMoE2qiWVkSGhBT8JSXh19wEx/fs/e5pfF8zMz
                    sHbpKTCoFFW1Oferc2LDp1Rl50AFbOGIFnD5pm2t24ch5Z/q0wqcQOO0aGYG2VO4aFdUZteG/MGp
                    iO+7ea7qncvX0Z+3cu494vmjsMl88cxNnDu7B04iDU50aiX4wDCiL6oo5AdmDbEty8eh758cHQ4k
                    vDQMhHoK05bly9TOB7gq3zx6E23gWRFq1g21wF3bUV0ElbDe30dKBNor9585YYMGzSDwMLWxnq1L
                    4DiGrbERGkD6Mkyf1LyZOO4cFGWhb+zYyR0tMcI6PicGbLNjy/ex+vHj7CTx/Yg3mJMUGBxEw8OP
                    PUEdndjjrNl0ea/wMsLP52aNEWzmxloeYtPhVqfN1gOBC1easoI05ZESXaeliVmoVG0iJsrZVdtQ
                    NQIq+JSkkF5EjJEZrlkGXvjsf3H3D//5HWx8kJCrrqUNTQJFdEYFE3gI2pOdJCAzG4IAmn92/ljm
                    Ost3BIGKpjW2HVEC+sHuSLASEdUERR0NT+iaRZmiY0vSWXs2nZWFy6cBgTxxVixrB8DMkLR3mKF7
                    LDLFGZYItRRV6YOzwFh7bMx9E9G1EU5wv3nh0ISMG4fe0qV0+P7twggA1ERoA1+rbWRksVAZqTnj
                    JSVYEeuQZdNQ2YmLT9oWBh9pQav9wrEMHEInHSCoiRlIcPAaWYGOPU3j24c+0a9/A9Awazn9+/w3
                    2KjM7s2oFNc2cjoU0bOInJwFNaA36GnXFo0y469j87+K/Awh4T2L52I3opacJNXoTQZs0/Fao8KR
                    Nm5BN9SEClKYqQLxChTt8Yp2bP5cCycUAFSuh/lcQsOaR34jUNMTS1gLtb+qPNkiIdoY4qiVwNqB
                    JYtDWM0LNjT3hZ2yLB1xV7NqxsarybF7FvfiEaMrtjXr0b5tZ5oiSoPVKdW6N/kjv2rF9I0csLLs
                    0emoXp43IwuCoMxdH2KIt2wLDiINTneWB4vjMmlXthzpBEzByei5EVCZg9ogKXzhwngPxyE27t7P
                    HICXOHj40Z2hhoQk1BAB11dehr6ZC71IQmuUx9g1YorBz2Q8HCxrkOrd+CGJ02CJNSRDC5n0AlJV
                    w9cvhT+PyeorSnV6/g9onjODh7Jia4OCK/fSt4airDlY51FyMWktGggMUEDUlFxJL/yS6/Agvbai
                    XRLQCmFMk4y8kgxFD/U6GmDhgCZzV9+JKYTFZTRDaFaANatsOJOfMps++woiQXZUrqqOYpIpGYJa
                    9zTxzauI0D4I82c1cX8KmQSjo6UKNwUEPDACbUCO0MmsOsdQuMIeDeu34ZO2bVYdOkDMyt98OCkc
                    GYVOOFvMDOCOljgCiHjhiYE4r9GxbjyomDGE8R1MACL/RLskaGZxcMSycmqY/H2BJvDM20wJD0vh
                    iW70XMFYZpw0px4/wxvHpyD28aH3J19OzBPdI1sbBo3xKWPXqgVatWUNJQh7KWNtS0dCmP+lBW1C
                    ImNEZ0Sgm5vB8HFmZsNcx8Mxd4SyjCmycHL2URzh3ej3vXrnBPfm4aMQwTqZMN7tQRZWqqyCddma
                    4sj3IXW2yZNw/hyrrwlVKBl1AP2fZ+ePrgP2/0/goszGWEmVmjJ4XL7kIpBFPvfXrvHlcZdy9exe
                    jUHKSb9UBGt3YoNeuORdm5eEDi9qd3bzEvPhL9FVTQnydCJE+GKNCeK8DfYb2cHSEgHaBuYEDMog
                    MNdV3oqJImkFeCEVWAbUcT1CSHYPnIYhK3Kbh4aBUunVhPUV4OymLsEWrRBnGuvTCY9MiksmQMTw
                    tCbawj0rzbozrBEiOS3TE5JxBDku3RL7gj+kd2wuDk3iiPNkd+mA1WzRqJp3evYs/UQhyaXYHnj+
                    5hYJIf+hoxbaIFc7M+aNu5G5QNmkGgqQs5YhVldT1oqBlCU8MYYfEFPxwsrxpfoMo5DL6kO/yEFM
                    lKicFNVxmxXVshTEcD4bJCpPPlUSqnhP4CefQjvVVsoI1dE5uWoq/oYwc/WXV4C3QR08USj0nb/N
                    Z+BZYHd+7Cy7g9LKSl4CMvgQBlPvq7++LF46ZJzo+v38SRDeuxY/kiHFy9HE9v3+a+Z+vYVnVsj3
                    o5BTQoKCOKITbQj1tM+O8wKzc3KGhrQIF6iDrpFm11TWgpq8CQPrfUUEZzBRk4ttfHlMoUXNq/hs
                    sjmwm3Y8VEYodIanQ/NGTHYUxJKgYk+CPHrTfiLUxQ5NcZKxsSMbcgAgODrNHPszMyHAyR5aSH/h
                    Fdke3VjoBmhJp4R6wZno6d5LY2D0vB6EQHOBsL0UoojjakpXp07w5jCpOVDEwg0mlG7tKAxLgh1O
                    lVVd0IoXH5Pxwsb56/xNDgVPiJtBFAYHAQF0NfCTFYSYnDl/RLilAdOTIqyJcQoYSiphySEhnGut
                    g+tWlHlCnRSfAndvGmICW4RRc8vH33w5l/sV+D5fYdeOq1gKW4OPzkpBCkJIQ79dhRMWloJBH1+f
                    0g9srm2z4nwEz1cEMGXxajhCqokJJFpKYGhZHZn1bE/tFm5ewKNR1tKKkocXNIdNWVYailgmYa8j
                    BUkIV917aYUNuPBNxaihbYYoakxRYOxfS6BNIeKZhakYtxhckoDXdBupsZ8jx6IdetI+ZWBWHNsH
                    jMLAjG6Hg3lHh0REIvNSSZq6AqoB0d1xJRfbVQFd4Lc8tDsaYhHSdXTcbuOSMQa90GbalzNVcTwt
                    iQWE5PjyI2HYiIUZTITWpqN4OykgYUVfUILHk/HCxs4tPyIRMQpmsCX1k5+PDZ+r1icBSQcJWVR4
                    AsBSYK2shVa44sHSOkdmyN6jB/rJnetErUkvIqOIpU4cpTgY+WCa6dvfCprT/aJ7CwH25dugI3FV
                    3YU9gVQHG6NyUzcVl0phTbqTumpKTi8a1bXIj5/OpV7M/JwQwLC5QoiFAhw8MYgSqKxEXIbNMVK8
                    bMwN+1AnQPc2vy/VrQ01KHnpoImgo8tNZXgn2PFkgKtMLOdU3jGD//9B5rR+VhSX0iFg+Kx+zaWE
                    wtjUNdrDcSrDogunczDIx3xeLh+Zg5IBpji6yxYUIclg1NwqpRBZhfHoKxCRYYGtoFc/NcsKomGB
                    MybFAR2AkjEpxwdOkvy3Gd3r6MQnd3ckPKUJWTgIaiHDSJ6TTVdaCv2xyG+s0JLCrQNTRBROKPd0
                    PM3r5+jYRuPeFJHddPjoc+xC4WAllEdDFFlX8kFhbVYvPg8Vg3agwuHP1lZj8rw5ElS+BFeXSQVo
                    K3WjOMSC3Es988OvwJLPdv3kaWgyfsZRThTg0eQELVXkwaFuT/egpFMJWSgQUhlm0A5aAkQrSGBj
                    IVlJArJYXBCvIYLMPHUCkRqhV0Ud7b+dOdzr/DLCwcoCxShKKMBJprCOBu0RaJQZaoyvLHvDEFWD
                    ahCBMrwjG/NhG7plVgFTEAA8vU0jBkOHeDXxtdhLbVRr5Nexzb1BQ5MTe1Zkoc5o8OxtZFVdSYP+
                    P05jmYkGiPBq/OmBVng03VwVhb449aEsmeLYSoCrHBoWVNk6M/pvnTRsC6sxaM1aSgJRCDppAHdZ
                    EQQtKBfOpQ7ajT5ZcPwb/o2B9tbAeUNEt7uPFk4cvnow+5oSExEdxSsJ/nkaXfGvsu0twCTtThHW
                    XVENyxN24QeXxun8By68o1xJnSwTIKcBSXgitdzF7AQ3TPTqgJ90dUl45wUtNAdGdTDPYPxVS/cI
                    zo0IubqD1EQFqFMjiYL0KurAIq7Fy42/h/lznZeMBQXRstVBXg0bcDGkoiMb4uHjU5bqhMs8PALN
                    IUs2o5ZjkydwBGp3ugPNQc6c5dSJPpIK5TBwxl68u6WWNCQhDunDrMgWX++DiMGxbJAYVV3pa54z
                    Ak2AGjPW0wmSX/XpgY1QMNoZ0R2kUdXZVlEW7XBVOGVGLLkpmcu2P/O7JjDfpF2iLSrg1C7DrCy6
                    orendqC2tzS6RlFWPCzFVfbLC/amzaQblfDNz5CvBiC0BS6D4hN5NbweJze934jFznVKybOR5LZ0
                    778C1QEhEOe3JFvcizRJta4s7V6x9+abJPYLl27gJ8m7WBM4HFVkwS1hQ65zia4w1diMXxW8ePR7
                    Rxa5zeu5/7zMZWHpw6g4kde6BGRg5DiPoGygqQI6+IWaRX/s4Vny1626Nvt+6I9LSn8DcMy8YVYO
                    XYDAp/PTG6wJmioHhsnVWKLfOHYEy2P5Js2yPJrgMKPftidFwYpsfHYWF8DGaF+WJaYggu72Mh/j
                    vMm5yLmVOLPjXkjoXTMCE+EDPC/bA6MQIrUv0wJcEKY+MplI6xQYZ7T2QGOCDB3wW58aEYO6gaK6
                    aOxobJAykKy8Oy4Tm4eGQH7t++gUlDCLTDR2H+ojXcKgt/B1jYfb0J+TXwUdKGF08Ac2lJuFLEk+
                    vvh7qkNIxOzsHo8EQUmVshQE8DrobaKIoK//BvIC84EFbU8S2khXDTb4kx5bXcs9cfjQPL86eNmF
                    RVz+1+zra+ZSsoxlqZcStBs0JdO3QQI3wCEKOsjXHhcTi+YAnePHrMDfjcOXoM5fLyGCQSoU6OwK
                    KigrklpQSWH7OO2ZestLwaCTGhGF2XhzlDs7B1ch6OzMjDmtpATM22xZxKP0yvDsfgbD+kelnCsp
                    kahb8eWFiejlUVmVhdlIxFqaGYHOWBmTnRuHxwJ94TWKaNrMSk4ZWfGvLoyvnc8RvLMrBrQC621W
                    dgVW0c1gxOxalVs/D65XNKL/DyxXNufsuyBTMxqjQbg5NCMSo7ErMHZGPHgkm4e/Ui1+sbG59j+d
                    pf75P4I42NaU2rGwUvaicfakdbCXHY8iRgS/rFheREsLw6ouXUEE1hdJiIDy95OUQSy17a07SRV6
                    6/L6yUFNCXdE5PkhZJnt64fvkXV8SB5f6NOygLjoe1UJnbAcNCyEe/mCDuBNfPnEaZrx8iVLQRKi
                    lEhEAZqSZtsLx+ELfL6JunTzHZzBQlMjKoU1BEkY4eZpOy/vhA9t9hzwnET+naO9bNwepJxbh38R
                    Aen96CHYOCMCvTCjML3TE8xxslsW7wNu+GngaaGJ2bhLVDyvDg0lmcWr0Qy4rjsbQ8GSuH9MOFw7
                    u5/M4ZP4YYoP4TWE6umYu1tWnYOiQXd0/ux9vnTylEfYq3L57hp7dN00vPHTyIy2ebVrFimoFNW9
                    y2aA7KwrywY+VibisYxlrM2DGv/0b3zM7Plirx1tCDL4HFXVoCjlIUEdGrC7UPm5MbIMlHiLQ0ws
                    hzMBHMNgJN7m2OuSNGwt5AH+YkzHsKpdBJThIJbs7c1sYfjQPLAwJLOYHFhoGFtIqNigKGluZwF5
                    85uB5OBoYkmuQRSClIpMRdIN/JHtdOHMM76lWrg/xRwOOhQiiPYlLUywYN/1vB8tFYz37+5C4XHj
                    +/fQ7bh4RhUbErpuW6oyHZDVm+1jDV0+Tmmly/cA6ND+5xeuTd65dovHcLzx/cxfNHDz7dZX76+D
                    EeP2wakX1y5wr2LajDnXMHcX77IlzYuwp3L53E3cuncO/6eTx73LQo0dMHD9BIwGXvP9rbVy+xdt
                    ZUzB0+GE8eNA1uMddz7NgJXCRt+HcaG94I0DeGL7khTzlpWLHVvRVF8NPRRoi+EcIphenpIozcU4
                    i+FgIIII6kRZ2ok/cQyMFMKI2eIgl0V5BBsrvr18FiK1LhdtWwVVXEiIpCrgJuXrmMUEKeHdGYO0
                    UgLooUJWkoY2pdf7yiXvO2sRFznBxRTC6oUqSMAt0WWDF0HEeJ/4S9fdmIp3ev4NTWWVhMkcpc0i
                    0TstxQH+eCJKdeaEks6dS9858G7/NHdwgwFwhcP+Ha6d1YMDwdhzYtwKPbV/H43g1uOsPv2bnDB1
                    AR7IPFo0fh2vnz2LZxM6KiEjFjwcoPR/w9xsAS2rw9fCjYcJKRgp+eDgnZGTi9bx/OHjjIMeHZAw
                    co7ceZA+y7/TixZw9O0u/JVlbcTrZmbK9sFQFSCSzXL176cOaPbug6uaGgOGIWAguPDyuhHIojfp
                    nRNaGyGnHmfZDQuwcizLog2dECZw42PWH3inrjYGKTShJFg0hY5WkbY/7AMf8IWNgUxhPbl2Pl+H
                    xMrQnBSBK3YwvdMCLTHVkkPr27mcBIKAPnPqbcQ+9/1t68fEy0fgk71kzAzjXT/xAgH+3t61fYsW
                    Q+RsRHYVBkFHK9Se95BKCKBOPNOz/+LvznxsASYdwJPuQF7KSkkd2nF7fl3rfYsOQUWJD27M2XJH
                    ckQKa7B4XPv2GW+9dvozQgBtakR5jAtZCUQlCnLtykJcYu965excndO3F81zYc3b0V54/s53zxv3
                    76GVe27UQdTwWDxUjkyqqjWK8NFgye9I+A5ciOzVg0uhqTByZjSKk/anOcUZlsjcLgPgjoboReek
                    rQkBGHt7P1705E/pK9f/0COxaXY3BeD2xdOQpvXjfdumBzc14Tm37cEIrVz6sPy4WwxQBYvRzcsB
                    LTi7KwrF8/zM0sQJlHCOpSirB13V9/uO6PjANLMwKLjBJc+ELEtGuPU3v34cn9h3hM6QFpmnu371
                    CEdofe36XX23jwIRW4e8JOxB6LlUJfoSyy3Txx+7OxFg4s967fQrFfFCz55GKk+bAUl4KFrAICW3
                    VGI0U9bI+fz30yqzC2n+HlXbsxUK8lhvNUMURMgDpJJVS36IrlQ2f8I2DZvGIZ6nMSUZsZjKpkd5
                    RG2SLToyuierdAtmMvjgU7qqsjJz6Sq8TfM1Y+5qq4VxKvBxYMxNg8O4wocMStyycJHG84gNy/eB
                    Er+w8g8buWm/TF1vZdOHEMid4X2DdrNpbXVlHEVImN1VXYWVWL3VXDsKl6DFYMmY4ta/4ZsEQbdE
                    KAFGlLGSF1fB6ctI0Q1KUP/Dr3hX3zzuhF7N9T2xAWhkYw01BDXzV1mCurwk5ZndvWxp7PI0kiRL
                    azO27+1g3du3YLBT4RMGfURWCxIrD0kZRDLwJApH57jPAOIf99l6ssli7v2YGxXi4o0jNCKU+RwK
                    KAgeLSGMLXwECTHlhcPf4fAcvGZSuQ5u2JQn83FHvZIs/WFEODXDE7JRrT4yKxbVA9BkZEoSY+nh
                    vFZBX5S3rPuSbuORrGFs+f4+CiZdwDcmv6F2BubijqQy2xcEAK1k6owbb5UwkMs7C9ajDW51djV8
                    1w7Bw+FvP712Jp7UDs7D8Qy+PSsS4zFwf71+Fc/QgcKx2MzZk1WJZdj/nVE3Bwe9NOrH+nsbIl6H
                    ZEuJQKsYs8nGTlYSotQE9FErNmNsgLT0BZUgaSfPxhbWKCvvo66EShchtxCSIIedhKycBeSgqOFD
                    rnElhuXPhl2XkOLHev3US+Vzj60MntyA3ZSEijr6Qs+orJwltKFX7SbH9APoJUKD5XF1FEJI1Inj
                    Ty5BRQK1DBSBkFjCba6y8uQpluO6wZOPUfAcuJA8dQl5yFmTlF2FU7CDuLS7E7txC7sguwKCwGq9
                    JycGrMZGyubcCG2sGYkZ2H2aWFWDKoEuOL0jEqNwWrhg7CluGjsaJfFfb0H4y1qVlosOiDYbbmaH
                    A0x5zkCCwtzcPDq1fw7OI1bM+qwtqofKyJLcCqpCKszq/EofqRWB+RhnW+0TiaVoxLZYNwJq8WO2
                    KKMds/A8NDczGz/yScPPjta6F8rzGwpBJYIiVV4M8TwYEvB2slNZSHRuEhuZ6Pxlzm2plTMTAzDd
                    aG+ugpkCfNSmxEr2xZeEeBEAWunrh18Tea5e7Vm8j1COXAwraQs5fhwVqGD2sxGYTLqiFeTh1hJJ
                    aCKAwLoxRHsXs2hcpVFEYPogiIscpACRkMJM3TT781VtRP+EfAwuzE1j2YEJqBdVF5uFs1Bs8HTM
                    CRyBwssvPHjugcHMiuwrny4bhUMgwbgpKxLDACu/OysYs0xerUWCyMCMUczwCs8YvDaqcwTG5ngS
                    E6rbHO0RMrXDwwn3rXPgLfuZqhOF44ENsjCrDANgJzbEKxJ7Yf9qSU4FhGBTa4hGOdtT/uEUjuFz
                    bgWnod9kWWYpJPGoXxFTi0q2lp1L/bPoIlXEKEQDkRvFSofUKDuR32v2SMVZcPHwobdS30JJJwZR
                    OnZOXgIq/wFbAQs+R6haH3B7DYEQ2xHUutxcQJJPKIJ1cTJS2DaGkxxBNYUsQILGISKCKQVErxMV
                    gowFAFRVTQf/Mpxmeu6nON83falSPnMCOhEjOck3AoqgKP+43DxdT+WO5CjOARgb3U+89k1WCfdz
                    p2u8bjUHAyjiQmY1d8ODZF+WKxhx2m9DDFGgcvrO7jieVdnDDLxBSHfcJwMDgEK50csCM0AiczCn
                    E2swpHooqx1iEGq20icDa+HHfzB+NCXD9ssvDDEfc43Euqxv3MQTgVVYZ1fnmYRZ+nD52JQ4fPfc
                    jx32sMLGnGXaljC+BG7F9q1xeND5t2Srt54QJGF+RiYGocpvYvpqClacEfBphZBaVwV9GGnbgk3K
                    Sl4UbtmUed5caF32iWBzfvoiw4AZZCVW6XCmtxMaIvKdgRKIKl5BBFaAuVkUCYDLGKpBjSKeVKSC
                    KfwNKPGKdKTgY1Igq3ZfkIFypg3ZwFlOkfO6P/a8a2u7158ByWJNVhvk82rizZjH8Tq7179hxXhk
                    7AmQFDcSKvBifDi7DNKgJHgzJwIasIB1JisTXeG2vD7DHPoTu2+nvhWEQK9vrHYlKHrlhmZ4nLxQ
                    k4kRWCtQHO2BQUhKMJOTgWmY89Hkk45pOBu8lVuJtahUOe8djW1w9Xg/NwI6oUF2IrsNkvF3ODC3
                    B260FuQO6PHjr/Ecaus3HZevjrm3BLx9oJJDCvIJkLRm6cOYUBVAY/TW34KykhRE0JGb27Y/PCj9
                    M5fkJ2XztyQdLwlhXAXUEZucQsbL+kj8aBhQ33F/nHoBcxiwNfABeeDJz4EvRHtuE1H2Fs82tilA
                    ACUQxjFRkpVCqrYFy7TlhmY4OxbYyRKyOJCmVFxJOyHlPe/6tPtf0dxh6HuLzvFJYXjMQtemXG9Z
                    i37/Dz6zc4WT0YR0OysYPAcsA7BeczinG+XzZOlkZja7Ij5np0wr4kf1zIz8VWYpFZDn0xw6kLTp
                    cG4nL/MKwLtsRyV3vsDY7GIb8k7HeOwbWgXNyJLMQp7yTstA7EYedoXKTvTgXmY6c/uUF6PyurHt
                    dP/5jnu7/F2PDAlLFT4ailBxvqxJ76Snh0+wZXF/tXrURCy9aIEKkiia+EFBKz8do6GJAc/+HfQJ
                    1vKHzZSL1QEQ5EGsn2zv85KPfozn3UxmXDXlkbTnSQu1AOznIScOYRQPgyRGkS3MaQgZQYWHJI0w
                    ylCx8bNwFvyRfePX4UJVrKqFBSQIa6NkZkFuCv7kDxZ431jGunLmHX0s24fPw0Lhw4hOsHD+PB0a
                    PYm1+K/T4J2GcfgT2uMTgWk4YzBWk4XR6F7en2WBLUBefGVuDtvbs4U56FeYEkbi01cKTcEbeHhW
                    FbhAVW2PfGdlcv7LD1xbZenjjrHIXTzpHYZxtEYPHHUddY7HWKxWanBCx0T8Gs5Gqc2XPsH9NuzF
                    gHbagbCmsNbfQmCWGtwuMGLpkdXLUK6cbtSFKoIUtSCYUyysjQ0Ef/uGjud2aVrr7cei5elJzkFZ
                    Ht5Ysbv72RyCr6wPotCG/ThdMsLuSCPISSFKeLUSQkyQElQEIcIZLiiCV2yaDwqq5Fa2yvrsHDY0
                    dxbuVS9NNVRSlfllArQrVfJHeX9Z825voanzTi5vlLmJBdiAkxCdiSX4xdcWnY7xGOrb1dsdrMEd
                    t8ArA/ORR7s7ywLt4cC4M64MzMgeTSfsatcQVYnmSOIY6K2JbTDWcrnXAwzhob7c2w3swcG7tYYU
                    N7S+wydcSO7g7Ya+GJrb3csdHMCyt6+WK2eRCmeKVhdsUY3L/9Y5/E/CNjD7VnJ2bBVlUbVhJSMC
                    c3tHcl2/ruPTc0sHXMJAzoaI5K7TYoUTZEWbtuWDV2FMc8N46fRGKbbvDjy1PILYfoVm2wiwD2ea
                    fnwMLs3rXryDK340ZwXcjlBBFgAgkcgZKS8CaweEuLI4B0SwSBJo1Olq+mh8r2XTHc0gqDunZAnl
                    AWtdJCZEuKkNfH9W+d/PRHxpbBmplahJHWnlhi74sdzgQOO09s7G6OxZ27YaObA46lh+BEURDWxZ
                    ljlncrHBmaite3zuHNrfPYXuWESYHq2JlvigvlzriQ7Iq9dubY0KYzNrToik0te2Jd+15Y3aYn9h
                    BgNra3xsI2VljcxxczHaMwK7ECJ3ceocb751wxs7dv3iKBolp3eR24S8rCmtow2cIUZ/fv4Qjh7f
                    MXuHPyDG4cPIorew/g+tFjePm4aXmwAf6h8FPSQahAlcAiQJ55X26H+s+nxn4Cy5M79zDALwLO5K
                    9cCBwRUpIUAUmTsJWFG4lZewKOo5Q4/CgGT1FQR4FRG1R0641ZCSnYNmYMhrPdKGRUUSmpivR25m
                    D7Av63jKn7a9v3Y451COa2tcW6jrbYYWqFdZ26YmmX9ljn0BtH4r1wriAEW+NsMc+nHY5X+eHW3E
                    K8fXwVJyf4Y0KgCtYm0PdpNjjiQ0zSowe2tOiEjfodsb5FN6xoZ4plrbpjW1tLbO3ogBVmFEl5JW
                    B5SiVOb9zDTaD+p41NkYjp6wIPaocgaTbAJkkhsSKKQ3xx5uABboT6t8aAcuX0afjot4C/ghaCZJ
                    t29q/x9sXBjZvw5rNO/wksbM7sxunz4abdjJspx9b6iFOUh5ecAmxIx9goKsPHwBApJGpnZeVj/7
                    xFuLhlO97ce4CfyeXsCY/BaGkV9BdTREqzDrhJKvqfiAC+Zj9Tr15BofSsPqGY3c4RS9qYYXGr9l
                    jSuT0WmrbHCvNO2ObWBxs9zbDEoz1OVHrj2rQoXJgZihPT/DA+VAsTbFSwuG9zrOrUDhtad8O21r
                    2wuVVPrGndA8va9cKiVvS5kzN220dhdXAmVuUPxOrhM4nym3TCP21stS7f1h3hQVLAX0YIJ5EATt
                    rqcGlmhBwXVxxYu47bLOz1kyd48+wpGh88wNXTp+Bn3JzIgIdgEr8+PCFCdA0xLDkTTx/8ekOwT2
                    Bhdv/2XdgbdYSZuAx85aQQSaLVTUcPwV3NMLJfBdbNmIOjq9bh9W8eSf0X+bUjuQUYJiWPgRKkon
                    UM0JCT+7c9CvItxoB6ZddZHJ23GdO8MzDT1BmLu/bFcjMLLOhiigUt22JV2zZY0b01Flq3xJ4cB5
                    yfFIn94/2wdbgbVuSZY55TGyzq0habu1lhTw937Ovrg/0Ofthp54v15p6Y194eayzCsDmsH2Zn1W
                    LpxIXYtf0g3v5NTzX8njGGuHP9Ghw11BGspgp3WVmML8zH3IZBKKYQOMakA+KM2qJf516YTJptZm
                    gQik27wkdZGQ7kLcLYDi2kRd1k5eDdzASzR07k9rf83H4NFnJF1kSxpuJ8eMlKwFMgiYGhIdi/Yh
                    Xn85ixRuBuuH1gDZbJF/fvY1wPM4yQFmGkQBnhPGn0Dw/ltuT9bxvL37l1B7Alr54YJBrL3cOxzj
                    0Ma8ycsL5zX+ywtsZWL2vsTnHFmWGx2DU4CDsGh2FjgQ+2BLthl4Mn9pM7u+idjWtRJTifWIwL2V
                    U4lFyGGXbhGEVgWZRajy3z12PblgMUkfxz0c/nxuq6IiqMYxNvWT7iDfQ/tdm9U2exY9xULC6twf
                    i4ZJRb2iBCWZHErDT85IQIEogQRNo0mMeDo1AAt9btCQt/8JAZ26/Pp4c9esuIECxgGztKYvuQem
                    5EloGEpSObNmFcQT5uXGh6COkFUdnwPhYoIl0zjlzWGEUlJFImssx7cbPI2DH/C3Zm80HsHDofi9
                    PrMN0/HTMtArDaMgBnotJxu7SCQmYCQUU2tmWGYlVqMNbGheJ4UgbOhmfjoGsKrsXW4UnpRFzqNx
                    JHKkZjZ/1EzCsainGZddg665ctaP5b9uJZIzLtHODOE8CfPEMAuSI22Z61GevYn+fvxaNHmJWRhj
                    yzHvBVIo0qJQUnFsQQyKwJLL6mvQgLf/D4auPTRuSEpaK3nDL5PHHEK/GR2a0LCmwdkGdpCx9dI3
                    gZGeHC8Q9bwJHfm5Keigx5FdQpqCKPLlilyEe6SBZhOlpoKK7A86+s9fHfsPMHLmLVqMWo8kpCgr
                    4pRpm64nRmOV5u28O50tvlVdgaFonNcQk4lFuEszlVOBJTiG2+6TgUU45LJeNwvHIiNpSPwZqRs7
                    FiyjKsITf3v9AhGh8/QaBxO/jyFRCvqAU/Nj1BVgj3Nu1Qm5rB/f7bfP5E4nVGXCx8FOThSG3nKp
                    CFlboaMoPD8ZR0zW/tV2BhJ3t49z56yqnQxSQQLy8LV/JjfSkqsmNr7quo49LJpoUEG8n1jE9OQY
                    SePnIM9TGsRycMNGuFZE2iQNI7YUoqGBCbjsYnP37Jje81lm+W9q7fitjuVshs1x1TvQOxJSMbJ8
                    r742J6Ida7BmJrZDK2J2VjorUbRvSyx9KgGGzPKMHO4npsqxqHjYNnYO3EpVg+bSXWLN3xH43wTx
                    vTFiPKB8BWXgO+8mpwIxlhJyaDbhSo9BAoobeKLiIsHTF5QD0e3/tl70mWb7YIYYKJCeykJGBB8q
                    Gvtjaq8/t9sZP/CizMGp88RR91Q7jI8OAlIQ5XCT5spQVET4pciPWxYu5dvoKJUbE4PHdu01pzlN
                    ju8WM9rZGjqIBoGXkUkhBkM7T+l+zGxSvcjLHLBw9jZFAoKvqYY6KbO9YFhONEUCIOe0Zji2805j
                    h6o7xNJ5R16oJZQYHYmJuHNQUVWF7SgDWDpmI1McuyMfOwbPpK7Nqy/78KmCcPHyPPJxw2sqrwVd
                    SAt5omYjt2QpG7F8ZmFeDBrdvc4BrTMJ/nkz37tWbIIPiqqqIXMYsZiVublm1QW1GLF1/Qm/8BFr
                    ZElHcPK/SS4sFZVgBzMSkSvDwkmlsQkH6hJjaWwWbQfRRRLBONW7dgnFlPlPKVkCWpgqQWPbBo5A
                    xuP6EfbY9PXcK1bYdxbfsxXFx/EGeX78KpRVtxfN56HJqzGvvmUlqwAvsWLefS7nlLcXTpWmwaMg
                    5bR03EtkFDsCwllQPCLE8PrHbyxFFbf5yy9sdOinjWuHhjkZcPFgYFYHl0GNalJ2NdfiFWlgzA6q
                    rhWFczCuvrx2PN8CmYP3gc9qxcj8MbtuP4pl04uWEnTq3bjrOrt+Lsqo04vXQ1TtH1ry1YiWtL1+
                    P85h8LLvbocYhJdzhJK1PYa4SZxfncvFumWdjg6MdrNZJWObB6HTZMm4n5gxowNCEB4fr6sCXNYi
                    Ymjj6Kqgi0dsStG1/eJeQ/wMLC3aywJHSWEsCKL0+gkYOvcVuOVZhY+q0xVjmxejU2jxmLiRY2KF
                    PWQillOkdCldS2Nsr8EvDgBwx7M5F2aft+XFmzGbeoIXYXD8ZOEpvHhyzA49PX8ObZC7x5+hyvnz
                    TiFaWXLFGI/ymRO3xFIvA1pVfEnq8psWee2JjDK6rE5+cv4mZIKvb1cMLxwBi8pAp7Q37+DRuTYI
                    k9I0UNwObfvqYO9Yal53RNSq/o/UtKr+j9a5Ya6XsuNR33+PQ5HE4pwJnwDOwPy8TilHLubvmPMD
                    ams2jwGHgI9RAor41KJze8efnrPZwekuvZSYFJXV4BArr1gL9Ja/hr6cNLoAhf9tSGnAi9JWTQlW
                    1p6B36HyHzR/sPsDBAnDtxGqZCDVjwFdFHWoiQth251ZiZvaRKu370CM7u3IHDq1Zh3ZBhqO1sik
                    IdI5Q3a8ntCjLbwo5EryY8JRSR2M0Wty5937Zvnxtb3mNzWhl2BCbgEonSI6kleHzyAt48fIZ/E8
                    v9VWOV+5Zc1AZbH1wq6/9paOBH2HsC6PncfriTlI9zUVlYEZmFO5T3HwGY21S36aa28JRRRYSSDr
                    KpLc7v3fMrsLDBunt37uDaxYtYOm0aYs3MEKCjBw+SFwGy8vDgCdGTvEcPZT0UJxVyy7J/yf4DLM
                    zYTUCv9j3Rg4BiQSdyVlHDhtmzcIIAMqe8BGV9eqFf+/Yo0DNArkgZpfLqKFHQwJCuPfH22nU8pb
                    B6iL0jQuXU4K9ujKXjpxHY/toA3b/e/4Q9Cbk44heO58XVuNavhpt+8CVjgP/44NebO7fw+sZ1vL
                    5N1ErfM2ZgvvpLxlzrEo8QnKYO8CWwsAnaj69e5Vjmt/b8/teXf31H1zxdWoZ7BWW4RiJ6S3QW9g
                    ydyl3vrxhbYmPV5GnwI43pw1PmbgJ6UgSU2bMn9q5bh+O7duPKyVOfpAIzdkvg6pnT2DpnLuJ0De
                    AryYerpCy6iPHg0qYnhleP5u4xfcm+CBYmhtJCItFSQgqWJHQdpCThJuTBT0GAED4PcfR9AV+AKp
                    ECqvhC9Bcqo1JBDSM6dsOLS5fxktIUJ2du3oQPTwUxplY4d6xpE+3vNQaWXSmZOBYUhFdl5bhRXo
                    2fP7tv8bm9e/sG+3ds5Br8ysgGHMhNx9GBldxtiRuHD+EWudTPK/CjscZjs+tODPoyWJ5cv4nV2X
                    k4PGYM3pGL+txOLprHsd+XjIHlaFV/XCmtwLnMAmyPSMXBujHcozR/xS4REBLMzOEoLUIARUExhs
                    1Q1Kc3qtxckNC9K1w0dRDRtTu2Ll+By2fO4PaVK3hCDMMCEbbRaYVpT/iQ+3EjUugkLocE11CcOE
                    x18/OXWfWLYGE9c9P69WitIk9hszi8pZp2KA+REEMSCaESCWkMkuZjGIXVg6RlUEegYVvgD9Q0wN
                    JeFljSvjMaFJSQxxNxmyQF6Blj7cw5f2mOC+eGstNxKNwPz6tKcK2q4qtgYTP2b9+8zjX4tfo6LH
                    JywOaMJG5c4eXDhwSWM9yd6d8aA8ta1xhcGDT6i2BpvH4LG+JzsIrC69PVDfiJ9MhHe3rp4hf/w+
                    wdHXd4wCCcqazBiaxC7ApNxKGKhq+C61uM1eXK6dM5QLhQPRdb22P/smW4cegg7p06gfN7dsPbuB
                    W6UaDSkdqpj7o6wrt3Q42fL7eP5cmtW5HdsjV86Hcn0qc9RFqoyaz+3fk3XwQLM1Zxbr1NYc2TRI
                    isNKLoNVpcDOkElmJK9WISmECgGSMji1qeHIqJzgawHeNlFVGvo4W16WmY6eyCXBJSPhTrx3c3x4
                    ndez+c/c8bq9gtHFi80VhZhEtVZV8Fy0djbuH9rj1Y4eCCnTkZHLP8nrEyL3MKx5m64V9s+J9ITN
                    7fuAvnGyZgr3MEzhQN4Fzh19zPR3tPYDnVfwgulg3AqbQ87A+Jw8Himr8ElkMMDD27obdQgDBdQ2
                    wc37S5A2MN9iwTE9wptg7waW4Ct+YtYKWphT4CEWzlBPBUJMaXV+Ce2PChcNlSilxR+17YtnbnF4
                    OYj/Z1sNCfcsOiKSLiI1QgQJS0FKIIJIkSEsiWlUV/usgYYpfRUrKokxBgoEADA2R1MLxNF6wfUM
                    otzPv89ElMdHFBkLQcvEjXLB8/+bv9NKvYvWnpOBHijRcElgtVdI0/AAszVoFbSefszsv/JrDMcw
                    vGwYENX2UJZj8TK12totC5jzcuFdfi36SBWP6+BhoGlstlg3G7oAqXE8iVBkdjf37Zd4OFzbWdOW
                    UiOuiqwExFhAF+/nh45iwXmc4r7ocyHz+kWtqgPjkNW6bPwI558zFrYD1SLKxgzxOQrJCBMwElgE
                    DjIsdHLzkhUoJjfxcozL4KFlbwRZPmwFVTH67i0giVlkUYsUeUUIQRNjZYFhSMSR07E6vIk25RRY
                    26CWa6BuPypOlcRbP/s9ctI0cggVxUIE8BYc07YMOcxV+t1N8zVrGHUtJxJtgbzxlYKsu/GSxbvC
                    OxM6v4m8Cy0D8WB4eO+l2wMPuJALPFjUBoH4wnJYNxZvCorzb+e9IsF4hV7uWV4EZcKk4HR2FPTt
                    F3gYWVZ/n8xehLLqSjUA7uejrYvnAh933j06cwU9eAqZIKGlIzuPJw7fChvg9v3gJPNS3SOLLwJI
                    DYkKew4knB3sgQtdUDvx8szNhF+kckwUlOBT4sCZQRadwSl0+c4H5/dO0a8khRVzbviN3Vw7jvmL
                    H/3dqyDssjA1CsrYEEcldRUiK481QR0KEvNi7b+OHIbzdWsYcJLKcJLM8qinG+4tvBstYrBntSmS
                    D+Y7DM8YnB7voxfwgWdi/pwqDhOGAXjC29PLAyLoWbQ/Mle/u8EUdqynGrqAA3EhNxOjQCO0gofw
                    9Ytm3cDf9eTrCkunQVEyJesxkOLlnODW1UZKSgWytjFCckfgLJ4a3buKiJ2dmDBxFCUWxfSWk4kX
                    SwlZGBlaIc0rzdMWkGCXQ6/vfsD8Eyd+hEBLXqAm8lbTjJiOCgoIKzhw5zv7MBrT0Da3F9xWru2I
                    +2c8IUVPXogUItFeSJpJHFk0YCiTBfWRXYsZUQK+s/HPnt1gSWTA4sj8uLcab0j8HCxjGezFiE5Q
                    7B2JVE0dA3gGWmazR29h/5h2DhGoPcT2PNKKyy9MKCmN8Hy+HactzuV4jbSUk4G0Jgyfg+sAwq7Y
                    8+8tpwE5dHpLgI6WqG2L+waad+Np4yb/aUT21xmESsbbeuSIwIwxOKfs4fPozYzl1hRWCxk5ZGX5
                    4M7Js1w/iGoU3l+awNv2S/CxZmzD/WkO9zV9GENzW4p4wQub3McfnDlncc1VHFsnRoxjTMTMtEvm
                    EbFIjUUCEvRJW8NAqEUkggkexH4spGpAKnFh0xZ8zUD1f4NmOh8764DBz08cLzmipc6k/i8o/Awi
                    qAGmRDSAq2xBVRNPQNmoWioZ0lQ/4QLMy48hNg9tQNxfCwhK+uo8fWsDlMTHgjuwAPEtJx1jMIBz
                    MK/jRY5k+bA8tmJrCnegwhLRkuQUEHCdWds+dwv3P5+bB44uYl8+Haqxt6tDLE9atXuO+ObdmGcB
                    19uBGj2LGd6dQVEerqh1nzft3Zv2Z/CBZmc8dPgLO2HrxlRQgldgmXU8So0HDcv9T0TAmbDLV0eD
                    1y2rZGjoYOcnkq3P2halk+qoUEFpEUYmQlSH1LkWCWQ08eZbKrDXYs3/hNmWTGKvZAegH2Uuj3tL
                    YK56urvgks9zdswUwHH6xJzPsmsCz0iMXOfoO+CJYXpAke3r714VOTsWv89PYdVo+e+MU5rszYOM
                    vxqmrczuuHR6l5OOMVij1J2VwH+BZj19hG5XBq1xkupEfC5GSRKCeDJAGPIlUeMkxNsWjwIBxavQ
                    LHN6/HpjnTUR4ZiAd37+DF8+f0/3+RZLiOMeGx8CeB68uXhpciH3ZG+hjeMA7vKB8/DCzsflFZdD
                    ychcoIkRQilqKfdC097F+yiPudLUcxyNcZyaqqKJBXQ5oEH1mUcgj5uZLiSJUWR7CkGBwkxNCHvj
                    OV4MFaqI0EC08c3X3omzLKwLKDKnuzvxfu1pbidHU/AsuXh6U/Gjvve6qsffUNlIZwd8Z/zxhYFv
                    jGYntF3RfBwlj2a4Bg4zZfKwfHLNVluJKfjxuku04GR2J31rcxCzvn2YPHEGPlAidFTcQIVJApJY
                    csciXJFKGGSUsS20vDV00VSV07IaFbFwS1aI58exsuv8wab97EksIS5Oi04NouWlaAIHUVbkWvZY
                    u/XT9+E1iYLZ46G+4GreAjLkCKpAhZIiVMjgzHk2tEcVSxt8+eRrVBCxTKKNDvPMSKSVCo3fRQGn
                    v1pWRDqZe4OHpTQa0k5WGvqI90ClXPHjn5h0qcVeyG3AKs9ffA/fpSXKj9Y7AwY5XNeja7Gfi1xv
                    xoDCxLKYTcXUPh8De4oW+1t43PsL88H5fys3ElNRWHQsOwI7/4D8HC8nDtxCnUh8TAWaSKKJEGcq
                    UVUS4hj37UaVMlZBAqIQ5v6pDuBBpvYhwfOXlKitzYy/YFC3FwzRpMJsHbr0Ub5AnUUCCpjCS+Cm
                    JbtEV9agE2bTrw4Wp/bN8MlqePn6Kewk9feU2kEiBKRcooo0hnSUo8np47i6fHjmGwnjEKxeUILN
                    IIo7DMnwATJMbe8xBIr0702YIAw26Js1FHO2kRrFS0UBQUgwvHTlNjfb2BWMVuzMjHtiA/PKnrh/
                    NlWbi/fw+eXL6Exx/SoysX8fDyBe718ZXLeEhu8t6FC1x6fOkinl29TNf4egMxsKz0D8N+0hdfuz
                    nJXMeL6zfx8OIlOv9lPKLrsp1RnlygPJy/iEeUHl68iPsXL+DuhXP0eg5Xtm7AlqQoXEhLxu30DB
                    whgbsz94/BwjTQ6IhopOo3QyRfiHQZAom4ENWSCiihDpsmKYsQcUl4sUeL+ZKIIhcfy5NHrKwqt5
                    NZkLYOgrQ0ESEUIltWHlWyaiiX0UCWcjOUO/hj84I1ePrs2+dJfzNYmN29cQuDIhOQyFdGuawCKu
                    Xk0F9DGTOs+mCBnR0GKmqhgjRNgrgEuSsxeIpRQYiJQohFmHL3Eyf1TWBxZlviCYRwo8L1EBOHi1
                    4L9AuKxcWTZz9R52+NVeyu9EIcCg7GnbwUnEyNxJGiTBwbWI2rm9bh3pmTXLp75jilE7hHTHfn1C
                    ncPH6C0nHcP3USF2dNxpPTx/Hi7m00kvZgr+9f/3KDk4Fls3cgjhXkfwLLT/T76/v38Or2Hby6dR
                    dPDh/H1QXLcffkKdw9dRr3Tp/C7WPH8eDESdw/Rtc9Rnmg97dOnMCNE0fp9SiurV+NYykJOB8RgU
                    shkTgXnkhuqOSrYGH5eHLvHk7v3IECI0NkScmghPRiiZQsysT5qJASoZA6WhKBxY+tekBgCeVLIZ
                    2OSSU3w1xNgJgMsQ0P3nwZRBHzFEjxUUMgqhAZoLqjLabm1ZMEaBoC+Vb7U2Bhtnf5aqRqt0AxgW
                    UgTxb9pSRJzPLQj0KxOr4C+lOGU+i7MNIpzhISpFOoQBIiRFOKoPeeBBZ3os5AAR8esjKwoIJaCU
                    Xw0DdBaVACLp+68EWGYRV7iGjzsLcvTpIrupAQhofrVuDF8SP41zeMtzB7d/sm7syehuPVJdhdmI
                    Od5BYuLVpAYLiPtw8e4t31G9jt4oXjCQl4S2B68+ghzs+bhb1Z2Ticlotj+eU42X8wHu0//EkPva
                    ewmEvPnuFncnc/03fslYGNRWIsvP73ixd41b8/zvsGYq+lE06FpWJrWvlXBe7zp08wMDYa8QY6qF
                    CQxyAZHmokpKmueegvI8stbZJLzBxF33lKSlB0QwxOKY1+yyKgxBGrhBNYvAgsYfKyiJeSQJ4MH/
                    0Eqig37IQxQenYumAz7t758potX7M/DZa7V69jbHwqClS1USsjhwYpaTTIymKoUIA6KkwVpVyeNK
                    J5knAk0FhTr2CUGCkmS4Ug2iRX5MvAQqG0Kwvf2KK+IiEc+Yrw0jBGRXAyrjDA/EYzsIrdm0QN7O
                    yGzZZ9cSMtAe9u3cL7l6/wjiUS4WyN+qb0Em9fNiX229sX9MoSfX66di1uVFfjTEEh9iWlYn1QCF
                    a6+2BvQBguBMdgo7ktdnj54khqEtZHhWOBlxfWeQbgaEwajhdWYF/tIFzYtAmNxDYHxg7DoVGDcW
                    xEPY7VEBjqBuJiXT1ODxiAR8RqD44cwZ3t27k78XcLy3DMPRA7bbyxPTANK1IomvsNWFiZ2VSOo7
                    t3w09fD+HkroeK5DGVWLieGLg/6b060iXlVNdpBKBQChZ8KMJk6936SUtQ/Uohh1gnjfRMCHVK9h
                    iyrwxpRilxpJMrylDXRbWVO2ZWjcaZk39+dYc/DRZmFw8dQb92piijELiBJ0QdMchoCpNHCgQYRA
                    XLokLFEWDcCBB2xB7upGHCSbMkEIVGUYFCCCzBMqRbqDCW5K5sSNX7ySrBTUoe3mrNUR1IDMM0zG
                    eAYVMKVmeVYXVgDBa6+mBPShaOldRiY1YFVuZUYUFeNabkl2FiSSmm9OuHmXkFWEwNtG/sVCxIzs
                    fOoSOwtl8p1hVQyimhVIaNBdVYS+dcFpuNVdEZWBOSjBXB8VgWk4pZ0QmYFpuE5dn9sKugFjtyar
                    AqvwbzqwZjRt0QTK2tx5yGIVg8dCgW19VhafUAzC0sxYaho7GgvAarG0Zg87iJWFwxAIsz+mFjZh
                    nWhmdiW3IZjoydg70zVnDu5qOxsl44eQ65IQlw0DWCn7wSaUMeBpHrHktAGUdpDLF3LdVdMdVZKt
                    Ufe2rUhT7bU/0HUCeNp86YwOqZGCeYwBJAQGF6JowAFSUvj5R2XTCjahD2bz+C6zf//BKr3wWWJ/
                    ceYnJ6ETKV9ckPKmIE0d8YavDhlPmBBJISYpskSt6UWXtiD1cSuyzz0eRfY+j7SPZAExXSh3qDva
                    w4bMin+pL/jeKrIoinCl8FLWT0scXRbb/MnGeuafuiLdhFlbxrylIsrhqH1UPnYvHABVgweBVmjl
                    iHaVM3YMGK7ViydieWr9yCjRuaZozt23KYa4zTpy9gw+rt2EjHbFixA+uW78T6pTuwafE2bFqwCR
                    vmrMOGeeuwasE6LF20DiuWbcK6VTuxY9V+bJ6/E6vn7cDq5buxchWltZTW7aJE31NaT+83rN/HPW
                    R2+eodPGtsmln4/PkrrFl3AJtW7cOmRduxf33T+sGfG8vjsV0HkGDnjb5KOrCQFMBPSkgMIYdaYu
                    Qx5FLGi0tjHGMaqstySqls7RxKLvTeWUKKwEIhsZgcsQsfSbJy3MoX7pQ8ibnZdjL+mnooCojExS
                    9sOvWt9l1gYfaQxG6DayByFDQwgMDSQBkbRGm4QA75xCwpJHKDKKOuVCBX+t6HEluyI4JAFUGACS
                    fg+BONslWmLLnfCf1sbwDyub5iPIq6FBHZqRPWL1rEFe63Bdy3/STev/sJF07fw6LZJzFn4Xlcu/
                    XL/JKfqNcu3HHkw6e/bjfvNOL2vR/7DNTHcm1csgwORi3RmUBhy5dHIEWcoRQUpIkJUUUAGC4hh1
                    EkUEcSWAZTfZVRSqG6DSFd6CNJrEy/h0spIkaMtCGxSzRpSG86xouOcedJwENJFWnWbhhVNwZTlm
                    7BuRu/PA7yZ+y7wcIK+YBCyKKeVsiQIZ9KomucnBBDKfMlBIIsokzmK30o0wwsLHnR5wDSMmwlqW
                    gCRChVjhOByoktFkR0GyVNSl5GgEii1CDSO15yPPi0MkZOXAI2bdz84cpN9rGif5s+2m8//1X70e
                    djdnDzdlQkJMGrTWvYkZB1FSjAi8LjAAqPYyQUkEpgKSJmGUAMU8+TwwDqaIxV8sm1xDOwUH0GEa
                    uEEqCixRQQS2CJIrBEElg86Rg3OsaKWDzRzBpjyobiwZ2mfQm+txzfDRZmbOuZ0TnlyDbpgCI5Rd
                    IsSmiQkEGppAyBRZJbrJC5Hw9K7PFIZ8q8F1+C9IoM9QI+iV4eByJnSt7kk4Mo1A5nd6il6Xc+uS
                    shgUVRBBsNTfj3ssDE2mHYvWnXD2+0f9JY3k+u24+1w6Yiy9oZzpoa8NZUga8yu+8mg0ByP3Eyyk
                    gisKRQHWWTBiklVikjTVgkI07RjhiSqR4jKQVy9UtsTcfEEqjiCVxRxDLBBBY3kgS9qV69DFticH
                    oZHt75648S/yWwsIuzJcbGJhcg16ANKqWUMVKoSmG0FDJJqyRRYcJZhikxsDgytBMtBpBwY2CJIr
                    CwUJqBhflXtmgQt3Yd6ZkwSlFEu+E8Agyxliu5O3bHOqCHLZbMW/jV8Zj/ZWO6a+vilai1CUSpsR
                    mSNAzgx5PhIho/WSkEk9aIoJA4mpglWVyEJHLNKQSGbOp4OXKSSOJRZENuPZzcTyAxNIsqg6jOoi
                    nCTCTAJJPWiSJmZnsN2cvJo6+iJkrC0zBt1CK8IO30V+0vgYUZA8zDm3cwOigJNZptMYCvjFI5GW
                    TzWQ9gqJeA/wcwODOXRDG/H4ElUoJFRtSTKFJizONGib16UGV40v/8SfdEENNEM5oljeMhySd3pQ
                    xrkS5sWnfAqEGDsGndarx9+21jLP9NY09L7Nm4BfPGjENYmy7IkDdAqawWioTEIDKSpOMoYiHGjZ
                    KVRYy0kFhCjoDCIhtxStTpWMdjQGHHke4LIeb1pTr0IHfP6pbdUkkmd54oJYNQ+t5NVgRn7WZI8Q
                    jHyPqpuHP7IQn8v87GfxkszDjAXLmBaXYhKGFDyvJ8ZPLEEU/+MkKcRzG/DKlzCQ4wblwURAKXCh
                    ZBQAmmV8YoDCxsxSm2H7GjpAQ86b8h5NIi2HEy7Dg+6Rg1uEmqoQ9FYL011eHSpS0mDx+CQ3v34d
                    Wrv95zfrS9ffEaF/YcxcqRkxDXsSeCtQ0o3BUgl1h1iEAVA4hJcqg+EqmDxBBbRJJOiyN9kkxCP4
                    FYJY7qI5p+i6aokq1BzOZAx1JUFEXM40OBANvLkrE2u/cWTymGOmKwLA8B2oZItPHGjcvXsJAiuV
                    dvfsx6MT8ELMwYxW4obMDQzn1RpsWWz5RAJPWAMCkRwsQF3D0iL+opLsQYXuSmQjnASJHflYQfgc
                    ObEvvNlgptTYLXhYDkS2AJIg0TSpUYQaI3VloVAWLycJOWg4NAFr3lpNBHXRHu3UwxfshIHDlwGB
                    fPXULjs//eyg2vKGS+ffE6zh44hoWDxyGniz2iVVsgWJqiFdmmm6xswvsQvgi1VA/FxKIp5HoT6D
                    WO6iKeOlcCsW40a3z6ngGFMUoUvWeAYIwTJ6ZIYFGgjsWHBwEmglglkuoumNxZgKoKEnpaY1i/ob
                    hw+Q5u3n+Gn38zwPm99sPAwrHLxRu4vu8QRnp6I16dRClbK0RaRI0tokbnE3tIwJYK7UI9IIgqJp
                    JYI4SSD4HBnwQcc1G21HtsqLc5E1i8yE35kysKpYpg7iiJzsPUfiALu8mPu5LIY4s79yFd00OoAu
                    tmbRBq7YrxNUO5laFvX76Kmxev4PqFy9yqVs8ePcXLx414+ZAq8CtD7d9ibMyGzaBnZX754CGe3r
                    iFR3St++cvYfGAkejnGISQlqZwUdaHO18F/hIiKqeQ2+I/msqbTwFAKTFEObnXEtIsqYxdKKVQGR
                    OJUaKZaKV6iiVdEkvMEkvvmauJp/qLJ10STkDxkpAnty6iTkbnJiYKoHoO1NRHVI++KEkuxNQZa3
                    Hm4p0f4n4+2g8Dy+e2ZvR0FJi7wF9ZB57EAsEk2kL4Qm7RmL7UwGzfvlACQSxVWpxQkUQej7u97s
                    jAQhXDNoJ0IjB5EmBCiFniKCVRRabQK0sJ9FsM9cQotnom0S77vzP1WEtioj7SsnBW0UYkaYOkbn
                    0Q1c4Uga27IssjCENSizAjsxrzUvvj9PqdeEbi/Bk19sc5qr+1N6/e4Nnjp3j04BG30NGje/dI0N
                    /G+X37sHrEcNw5cwbzohMw2tYNI7pbYUDL7ohlj+2Sq3GUE8BeJIKrLAlOCR7ciQFsybV6Ejhipf
                    lII6bNpbrJpZA4hcrDtEkygSSFWDWWdAkTsTEkehmbpFM9cPqFysgmzvtIyRELy1LQICDdogRvKX
                    X4Khkj0dwdAwtqcPTYOZy8dJsD84+0vwUs185cxfz+I5HbzQLBcgrUqyj2FyjAm1yHBQHFlSoinn
                    RMEgEmkcASo6AED6Jke+pFtiwRWByYu5KkXkaVk0Epj91zokrNospjKZuEYbYcDxkCiiDov77U61
                    ij+MgI4U107yNQhCdRvTMxmh31YlueEB5KmohWNkSORmtUNOuOqg59UWHlhiWjxuH506fkvp7i+b
                    NneNHYyK2kNH/kNOT6JSLc2ht+PawQ0dUUSa1bIVZDHSlqashWVUcanTdPhlyKSBOVpNcySXOEU7
                    m8yK0y8LtRBwmgRmYRHwtl7el7HypHNLFmKpUrlfKcRHlPJpCksyiSXEkysWUERY3hVBdJdGwOMX
                    QMYxUClj8xkxsxkj29WhKIrKUIMIr6SOxqi5EFA3Dm+J/bI4AB6s3bd98ErL8FLMzO7zyIRcl5KG
                    vWknwvGzchhhFQbyM340G9JJPAUkz+N4ZcCntUJIDPHpMlvcKBhQ0oSXMVE01MUkCsVMEXoII+96
                    MKZ6mMRG8/YpUc1lOpotl4QyBdJ5Qvjwg5NvVQCcH03o96rysDEkUJEdTbM0kcl5JrKKdUIKOIeA
                    JWkLoGfI2bw7GVCdw7d0JEz76I6NwTXlrGsOarwoyovzc1qgc1cLKELIpl5On/Siim7wtIYwxW0M
                    IIZT1USikSkKXJlTBhT6EtaYkAYs8IAhDTa3aUXKkDhApECGa3Pug41mFYeJwlI4NCkZBCZD4SiT
                    FjGGAIbHEEoDAqLxsBZwNwkRQSe0rzYMOXRm9iHksFcm3tO6GBGG7LvMXcKtsssScL2ay+psTef0
                    z0+7t33Pq2bylKe/a0EVU1Y/DmzR9vzvFVsLA/Mt/8S/o32Gx5Nnur6fWX9OvjmtKxVRtweuBIzL
                    N1QbqIGoQKy4ag2b2MUGrcEjEhqkmsss2tmI/2IIA4UOHZ5uN9SI/YswEqovA4aux8ou3+1KvqqJ
                    L603lqKNURWCr4MsgiFmJUze6ystl4geTzI0hQR5AfD2erBFAUxXp1MAExiS+JfuSyaikMH0xsN4
                    RYr78Sha8KbAcNMVhQuG9OxzjQdd0IwG6SsnAjMHjwZUlTySFBRg7lPAUMJ1czVKCOGml59KNr1K
                    hqopwYsoTOl0EskkwADye3wzUuMU8U/cefIiB3YkcXKkOggjy8OYAzHcLAwkBDuoU+s+kdSdQBWG
                    SUIJLj9kvwo7yzOUAexEqBdH5XAhpbfKcT/dab6iuylTH6e3uhNjIaZbEJyItPQV1RJQZml2JwWh
                    lGk+udUjAQE4sGYlBGP2SHxiLU0RPu5g4wp4CEJ6UKS9fQPxTCXwULezg6MrYQ0SklKK8egdkTFm
                    D5pEVYNGoWloyfgyWT5mP+hLmYP3EeJjaMR01hJQpSslCf2w/D43NQ0M0aaar6SKZGiafeFE49hN
                    2rcCNlH0lUW0qNWc8mdhNYQqiifEV85Fh0Q7GnHaLNOsJORYEYRoJcmDQyqeL7U6M3UO9m96CGUh
                    pBTFFLojiXKjCZABNDFRdFlZ5I502SkicA8kkXSVNlS3GheShdN46OKaRUT5pgGIFzCKX+0hLI5o
                    tzO554EmA8BHSsogCRivIIooiNhaZs/IedI4pcYz5FeFWkwSqJYQqo4StaG2FNajRmeDohTU2RGl
                    hIukXIzYt1oLwxN+RJbtCX2NFLUQm2bCheRRHBVD5WtlAqO7tLnEYdIpHqKY4Nz9N/k6hs8XQeb4
                    oqHSkltDNGjKEuQgjEPgQWJu6dZKnzUZ69yCX7EMs60PmsZPjoSuXuTuV3E2rBQ4Y0lLgqCWIVuE
                    urwImnBHsCry0xb19FDbRT0IYSTxlWDn7fB5affvoZ9UOnQlZOHTJEuQqkN9ooa8FUSQtdSAt0o1
                    7US0WTkha6C1XRXU4ZvenCPei3XmxeCv0vkCKXVMpYjpwi+WByQVRpjD18yBfHy8qihIGFfHytEo
                    lRqjB/aqCnJCAZo7F0ctdOBGppIpAaLJOAMYDc0HASdsPJpYyg40dQQ3FgIapm4w9sEwommuPE5Z
                    Ak2QSWIGIZRv+swdnQOIsoGFgaCKzj6b9jqVEGEViKCSgJBCZuHIidh35nDc7Gd9h5GWNxO6IQWA
                    oILLXkCgaxVahJt8yLCGhiW8rznpFDkKSvCT8RCVoB0xTU0ASeArOeWJ6Xj71Dh2NFWSmiOrSBNT
                    Uwt0UPT5ZCYz5iKCWQm4zl8xFJoImihvel/4fqa2BdbTk3neHc4kVINGpOOpDcGHUufxGFywISw+
                    SywomN/BgwCSwupIW8yN2G8tUQx9NEIk+DGFoFwRJyXETKxrNY8MBWU+9AbliVGNLdPZDzCL9nXw
                    HLT6gYOh5S5D74pOgVyY+2IMrvQZrDggpvoyiEnbICHJWV4KzYtN2Ig6wINkSR9mI8YhFlJMuoIF
                    1GgWOWOKJfdvPQnyIYNpwfQZWeR/pisEgLBRRWZgqUCUR8DI+JxP65M7mHsp7evIHB3t7k4yWQQg
                    1bKRRiBBVsFLmGkdRzGki/lNE5k4glwui8gdTojPYjqELiCKRxssrEDCxiEIcjNbQ/haFsvCKD3p
                    dSGki9cwj1eLYLGxv3YBtuhX4ARjCxEZvzGkZ5DySd4kufA0l/JFGey+j6NRSJDKDrVFC5B7dtiW
                    tTJ3KAYQ26dEA1wnU04EH1ZEcskti9C45vXMf9xmbPsVemGyZlpsFbUx2OVAY3Aoc3NV4QdYhgco
                    Gh9BpJLs1XIESJl3vTf1knomtsHDEakWwhHiqPF69pP4UoYpVoOXJZ5LodqCwO1Gl86P8+JO7D2C
                    xFGSVqExFXDgYU7qYuG3qgOjWlNlaheuvZtTeWrN3yu+zyVWapHjUZ4tR7paih1OUFaEMZ6kE9rh
                    ddxIz8aR/qGTbkLx0FfNiQYrckl2FBGWW7n/mTZoiUkEcigSBaVsjd2PKVIdQTULwJKOEk+tJJHB
                    bJUURBQjOKkO1GPcJdQwNeJDQLQgNx9vAhXD9+nOuVQcQe7GH8gcRSI4hCR0gLSbNQhETnjCBB7E
                    WJRVjuROHe5KqCiQ1DBRRhkcZgvZvlk43HeFCeWa/Npe9r6Fx1PHmU0fE5BJgkAh8DCmMWT6pkX3
                    KP7iRMHUmIO5CbcCPAh1C+M4kBKohBKwm4pfLKyFFVQUmblhiflowj82bj+f17mFs3AE6KCuhNQJ
                    g/ciTX2Gxtt4kD6jCquASrJk7kNvhcOWIogui/VlQ2ZzYnmcDnSuf3Ip3jS+LcWSCPDDcnDij71q
                    /FvFGj0D8wGD5aunChjusl4MGPOjG71+ZN5XKnVxae2xBobIkB3Ym1vCg69CTQOxFQrKhsltRR7M
                    mFuRCb2vGk0Y06qR6VTZGuXVBWh/dEFF+zr4KlYthUiFG0IqBK11VQRluqYEcNTbiSa3BQV4Ez9R
                    5PI1146lPS1oM7od1RWxeOmroI0jVGpH4rxJu0QbRxC4S1MEQQ+dsAbU2EaWsjycAQabqGyG/RGv
                    nG7RCja4Rgw2bwatECtkYG6EPHDijIxZUzZ3DhwH6ktzFBtqYGCqgSB4lUMZAauZiN0RCrxGsoI8
                    JAG4EGOggy0EOorgEidJshQq8FQpu1gAedz1ZPE04tDAiIRog0NKJrGyBdQRXJxBJJJHZjqWxhVF
                    ke1GChRs0QZtIWXnrN4KxBPdjQGC4GzSlvxghu2QJxLSnfbYxRZmKCQgJ2UstmSO/eHkkdKRx3ss
                    PJtauwlZgmzd4afam8A7Iz8fTRQ7x8/hxubTrB1agV/Np2wNLJk7F09HCkeDjDvrkRvOh8Ac2Mub
                    Xewg2o/lq0QVib9vDp0gkn9+yhUP4psgID4dGuAzxatIR/CxOENqe86ulTWQ0QRvXH9lZw0tWBja
                    4WrLU14KpLoKI2c6ZQ353qyMlAE466atSGSnBUkIWlrAy6k3hvTqDikXuKS8nlIqmv2RfBwtBVNG
                    ACJCSVoCTUgBqhs62UEPk2jjiwZi1uXrqIW5cv4faVy/TK0hUu3WTp0mX6/iruULp7lb1e4RI79j
                    b95w4df48+s6VR79MxD+iYu/S+6Rj6P6Vr7Nw3bnBLWrHplA+uXcPVAwcwsGUbFBO9FlADpxFtRx
                    GrHVi6GHfZuSlx12Ln+pg+nPM6nY+d99bVpu/uUh7WDhmORDVNYi1iIgKKj7wiknr2pN8pP3Q9Vh
                    a2W/ot+tz036u4fY3KQ+e4f+0KtxvrfXYu9nr9Gu7Rbyy9IGC8fvYMD2/f5q577/atTyuUs42ebl
                    6i/Fy8yK2z/4yOZb/fYOenxPJ6m83XZee9co3Lxw3KK1tlkrHL/Tt3cJ1+Z/lhxzaVl8pN52X/Ye
                    e4SZ/Zda9fojLT+xv0ytItqp+bV9h3l3Bg3RoU2dugF+mczsRGzciDyBBYIuLT8e57wFJYORo8GV
                    WokEhSIx3Sjvx0gZUjjq9dhzsXz+PWxXMEkCbQPH/8mPsfK9ANqrC7N5vWb2P2srGRu+v60dgs/c
                    fUAM/v/3oFyxcPHnJ0/SVj3986cgij+loijbQRux2fSKI5gFzk6vFjcf3MqV/tb8SOf3L/13NMHz
                    24/0nAvW18js0jRiFZVx++5K+DyFUysER36oirJ05wILhx/jwH9q/liZWvkQD9/OYtrtzMXtA1Pz
                    +egf31Z+vJsuPYDuy3LxIIqdEZSK5SA37czZ7tzPLo+k1ugjkzdnzjb3bmeET19vkSZ+/evMXLZ4
                    0fPn1oA8r3NQLIx3yxpTg+f5LyxcOHGB4SAUsKXNqShNAnlpYisITGpn4fWIqrRkFaUgQFSgbEKp
                    2Isr21DZDVty9K/TwwLCsRWxbNwfXzZ/HsQVPDsMwlR4ehJJMu+u4tNxI6d+worCZf/urlCy7Dp7
                    ZsQ42bF2b378/9hxnrQWMz83Bmzz6uItgMd1aRL6miWeXfOHUCte7OyG/dBpEkWiMpyokiEcgmC3
                    lrqyO+rxk2LlrArSLArrF/x05MGjyYOzfL0xUCdH1FCdd4TCtsHDceBV26IUqJIgTy7aGyBDyhCC
                    4kSmO6dcOYtBSUh4cj09eXG9H93Fj+2BMEbDHCDRVVmJmS8alRVjYM5ZY2ZcZAwpZGO7y9aZd4Vo
                    5TBw4h08kL/SMTMKeuHnNGjcSkEUO455GZXTp+CqW+odi/rumR0p/evceYwjLqkFe5a7COV0eaZ9
                    emzXhPv7FOuGX5akwZPAJPPyy3fpXYJNjDA+GensSE17nv1i1eir1bt3I7nbEBuQOr1yO5U2/SSk
                    poSSDRJXaVJFEcFPOdYMmvGQYxEnZCoigDUujdKPWhSrXTVEFDbgYObN2Axse/Rj3LWPc2zeBh3R
                    tv3rzGgS2b4E8N6dCxDY4d2Icnt++g1M4ZqX2tsX316g//AgYnpsCORFtVUDieP3mCkwcPISM4BP
                    t2bOce55jVrxDW5HICFRQRRL0gkkRgKBXQl0JNW4rUupL4jnd2wNVzZ4hBHiDQyQnRfn7cM9osTz
                    GBfvBzsOU+nyEgpZJo9iCBGErRQJRAjqIPHvwpsbXru5Norgj0weo5s+Bm2hXH9u//FVswl8L26W
                    GbT01OSEZCtx7cNX4igPf38ufyz+zEjl3wN26LtXPmc5/Zrh1hPcxhp2eMzUuX4/Kx4xx7XaY8f+
                    z1B7bugJ2+MdbNXcB9Zmzp3b4rCj0oPKdr7F25Gn1IrwRZ2+LBnbvkVq4hxjsQ5m07Yf3SFRwQKo
                    uKYExaZcq4cTh75BjHpuOHDUd8QADn2u/fuIlCT/qPjDK6icmhBYl7bZ4AEiTkA2LTvg8sWQMbIE
                    bRj4KiAGoUlrYnMdSTGiy2TzfcuHCOo+HXxBbPnjymHt00l4QVyKZLK8ydPJaj1rvkkhZNm4xZ48
                    dwvvnRrduocvfGipGjueM/2j5ybXNGjMC+NWu4xjh99AhyIsOxb+d27lmfucWFsJKh0JLAEkaMEi
                    cnRAQxTAC9d+Tx4KKjjWl1NXjx9AkHiOUL5mPOlCncCo0sTzmxUShPT+WY5dS2bUgxM4UnRXihQj
                    lEULlCKSrwoUjJU8RHX4qcKoO8OYBsXrMSW1Yu5240sgZlC+aw71nZ71OvHRQagVwXV+4adxauRG
                    kPC7wkymd2isASQSJ145x53Ge2oHJUxx7IdvXiPjNj7NNILvyjezxC/xmUmonHH3Z2Zy4mrJsZSt
                    z9uWtsW7gIrm07YtLAQRz4Gon1li1YhKnjx5POu8IxR0VRPjzsbLnj2eOvjN3rysswdmgDx5IPSE
                    vlB4Sgq6Q8OokLYUQeQ4MiO3EJOfjFZXwfWHIGE7NQuKmkpAA1CsfaUk/uQv49084G90jUNT66j7
                    qMeFhTlDG1dgD3P5bBIPOeHBWz97+1R1QJZY6uGJ9X2FTprECUObYu7efHnz12FCUJMTi8excHls
                    XELM4UXvoTu0UQQELF2V6NbHSWjStIIKZdO1w5+eWlU9l5s0NCUZ+dy9H2yc2bkN6jB/xE8gghoL
                    FnmCIJiGHs+SZpSfSSkICjvgaekF//mCcGjp2rVqMuOg63Tp3mljmf3zAEowqLsGtx07Jnt5esQh
                    ExB1uWg9kZavhYAsvmT2B5jtgupigi18aMlbuawOasrsWJYWaHtm3HwnETftEwBO7QTt0xODiKu8
                    auRYuQZG6FWxd+0SOfG2OWAcV5cOjWhesYlw8fwcT6eoyg9nn2IV93b91Eio8PtacAbaVFFDYLoC
                    KrSF5EAL+E7O8DS8HAUXQCHhSkRNCnE/XkqcCar4KYjt1JUJ5FI1Xm4PQs2OoYYkppk/5gBXBp1h
                    pLqwfiHVuCgiqZgeIjMBrv3Ue9mw+iW7XDvvnzuO8WFffDqvJKTkuwHsa+O0nhcn6QPw6TG3pPYF
                    ldVAhHAogPgTVDTQOpfBHiCChhlNg6rv703dEtW7j/c4ldk14/5qk8IgYNKVlcTz2zaSsyOpnCnz
                    3+ye7mEujipCixQS1yRW4kms1kJNBHSR5PyN2wub6X9h9EroMrfAxNsH3+Iq5cH8/98f2NZSuR1d
                    PsE1jOkrtLNGmDrXOb3BBjkWQrc4RRZ2J5WztzKsKMWxEzCvGQRDKzfZs2oRuFstOHDuWu+5zC5Y
                    BWbTE6Mp671qHly5HQpQdGh8fiKbH0x7KyY9nvDCwN+VnoIC9EXUw0Bzb2/ed288Y1RHi4oAUxcz
                    NiFXUpOcjzFCDG5sSkFHynZqkeBRlpBSiTwG1OYOkuRpQvUIOFjADHdjbNsGchsoeuCeZWDeL+x7
                    4LMGoDb3V9rM4pwfLYdGQbd8D/196VR0V15F2RfemmoREEIcgioKgwKoqCooLs+77T0OwIAgrIpg
                    KKIKiERIO7EeOSmGSSmInRmHjQyLjExLglKkTUUYJGM0Znkpn5vju3Hmdmck50kjP/zPyROqdON8
                    3bqurWvff3qt6rqlmzcYNRxrcM/Vb6+CFcpkALpUFU9O8aVyDeyhIJtjboSEuWXuZ79dOzaMvNwq
                    Xek/iBlfxOaRkSGbGkGcqRTMDksJEFu6QyfI7U0EAAv6fZO2JTQSG665chlZ6kuaREuh6Rq2Pj0V
                    lEPWblXf7gQxROckeYFsHGiEpNxhK31pN5DDEsIB7cDzTQl5ZTma6lgVArK0TQTwUaKRAsQGrjhB
                    M7d0vHFWb3ZNdL0vfBg7/DEjKWiAzF31d6epA3zglHdw9v++S7R0jzmISZZobY3VIv/daamobi8a
                    7SMIdIp2hcp2pqYTLl0GuSPTICfLDAVIlXikul7S8dfAeZjuMRYmSClfQgG2srkRHki7Cpk/HRW2
                    9IsrO5shxTaBti7MbihQyVtESM2Pcf+fatAahiwmHHsj+nbQhTgkVfR4YRYkZjSfV/BpZagkVjhD
                    4s2QMd2EAebBhx+zqYFRllYYYzRw4zBLuPjWlqbKmolfYTF6O2dYBKYYZCYyWWKkajXE+BcisbfH
                    H8OB6TWbaERyKCRjnK2hzdyyqlfXraW1BoOwYdgX485hCunjvDqCAEZw6/L/3/Ec+TQAZINZAjUV
                    fMuBNjG5rSY7GBBEuwhrh7Sc2VK5GgtEQoGzbVzgGntu+U9l/LXlYW6CvJx5c9xygH7vCh5IQb6i
                    JGuguqjVhWsHjUU4wPiYWaxBBBkBjtJWBEjqZ/y6AM5ugaoMTMAmu95mCt9xy0+8yTziHyRpUK+3
                    LV0mKV/QR6mesE1HjPwu1PTkv+rtTHEzN0RmC+ubHECie2b0Wl1yw8GBxeYu4UmWUm5XA2feI0mQ
                    68+emjp4cOAkMc/+ahQ8hxcEKkkTFiR1vB30wJD1673xhzvL1tiyTnh5ubpBHpKBNT+FOy1VOnIc
                    VzBnIjw6UIc5CSl8fOM5qG1ooSZKpnhBGMLkfSt6Qv/A+YRdzBbVizBVojZbDUl2MMG8RNk4XUG4
                    kA3ZFYwEotnzkDu9l71wSHIdnaDlvzC3GitR05xibSentVxsZoV1qggTRbpK2N1XO80J2egoYJrk
                    hmBBKuoEG1UeJoe7MUhu7NUmHJKCX20au8VlWCYg83FE35DV4rK8er2XlII20m09gmyo0RSo8RxK
                    hFPHi/QDTqCA1p4lMiTVqSpiESqcVJhqY0nN44tv55rImOgpfSBM1syBZVKhJdHDFfpo8AsTI+I6
                    BQPR2G4cMTlMTYifSkAY8rwCPmBsezQdK4nVpXH/k8TzlBu9zCGhUEZ63FGLzL8LmndjkaJ05GpZ
                    0d9qjV2EmfVOrsBJWNFZrDArGrrBjq8eMwR5vnoA8Ua09uycpEmoMdyn3noZsmfnVCLBYoZPCgj/
                    LWEoOQ+tJ7ahPMzFjXi1h/GSiwtkUkw30xYBhtKEOYTAY/Bh6pLk7YXJSH9RGhSFQQTIwUE5WjEM
                    A6m6arA3ceNzc6EnULF9LTeEDJUFmpqQdjfRl0qBaCWeaFxGH3b48QME+/5f8MZvkblrZsggYlyJ
                    ySYSnAQh1fYKxLitZEIAscYcQoggyTam6OMIbXqSYmKOL3LDbgYkYatYYECFmogRRfwoLnynRRaC
                    pHvhElRFsLKcZiDEQDhZasiOwsrLN3QJPMGBVKJYp4XLVcDrWBDIUKJXIVJkimXIhh+GiZIfy1NT
                    CX1yQmd4cQmPHs7Vmk5ixqbzrDwUzKZ7bRKCQK2bC0RQobdBYZ0svYFHMV5vDSk8NTUxfeI/UxT2
                    R6H38NMU/EgGDRJbsYIJaVF0Pgic9YbSNEMWSPZZip0hCr4htjsaklSuSjCHBrlJlZo8raEaUWz/
                    HarVFibY+FzzkgnZ0lnHQfRYCnjrFGjJk5PYoBErlvnGwUUs2sECMzRYS4g2xqikTWX7RcgVBuE8
                    nyhrEuEwnSJH7PZucrtrBADsGRR3OeTVlOpZRKI81iUJB1GiWXIZ1eS7xnTsX6iyErzaNhd2M9TT
                    DQxjiFHHamJrAjWK0JJgX319XWgzbBr2mghHdQLO49eCix2NPSM8FS0dpFg2sEE0MTWPKCXEnJfn
                    IWQK6DKEMtROtrIprhZixRGy+G8tkDs5gLyUCV7PWN3KZVXxtNbNgygitbb3imeraIPthj07i/io
                    DL1RcTsUeigShvoYY2yE1RSJMnZtAtZGPlkipTtcgqRjIEcF9fgsOfVD2XFenL6wpglCZm+ycYKJ
                    BiqESSjgLxBEsczXiYjhxRBEcsGy7GdRrCJ3oiyHkawlw8+LcnYl2mI85xKpKdPZBsPwUhirHwHq
                    GA5wgjeGvI4aczCvGWzsh1mYGc8R4ocPVApfsc1HvMR7NPKNYHxGKNbwSa54ahaXYwVswOwjLvIN
                    R5B6J+ThAWe85HLsPlNBd3hFvZYy4B7KNnSjk347WbEPQKzGa5Z7Gs8ymjYUamCCWTB4kJTpTYUO
                    HLKBMqEQVShrPoZ8R85FLKUCFZTtycTGFO4O9i0ns42VBMaxDTOpIJlBiy0jxNDcnDuMp1MVauh1
                    EGWlDqasKUnsyQDKXN82poGUGD1+LuE/Zvlxl+pgzVrttJsMih0DeBPZHvxgP7kxWiSXkCJPFEcq
                    qODtLJKio2morozWdvX8ILrmNu1dPAGh0NNBJkpczZAijMBbzwAtK+mFaQywKIKYSlLGgzQdHKHr
                    yMvX4RDexC/l3K8xdoki10TBCnq5AWJBArq83n9XjQR81ir51PKQi3skWiwwRkEhC5U7yQNWUW0q
                    Z5QzXbF3lhEViaV4SaJcuwbFkbampaUVe9Go11bVhZswYrq1rQwtxU1oiihDwkzotBFBs+enYIkh
                    fEYnFGMdqqVqKjtgXrlq5GZ007Xlr2PHas6sIrbdvRVdeBl5s3YeeqTdi64kVsa9yILfzsWt6JDf
                    Xr0Vm/Fu3VrajJrUKKfyJCPQOhIsjS50UgdNJMhLl78nMq/BlFBtk4I3SMA/yNzeHLjhPEaCWOkp
                    rGnE2Gy2P588h8xWzcfGY1f0vRJAsRbGJVf/HynjjWSTLBFEWZCmCbzWYbObN+rdlmljTOJgZkE3
                    ZWHXY6Q0NjKC3t4DhxBrz8Y5BUWIMfnvEuX5GeySzV7QSLthkMtOSwoVueSLQvIOoTKBXxvJB4mk
                    pxY0y8DFk8+JRNsJSMGIlKfi7nxbTpaZIpRmI5maaMgMgnovNJhYU0ydlko1gCKpkFyKRxLGBhKn
                    l8sUhEGY1WAXuYmI+i1jKFSs+C8mOJIP3RSLSdiMixroibOB0BTpMRN30O8kNiUZmsRn12MZoWVq
                    B5cT1WVTdg84ubceXiJTS1r8fAzVv4w90h7Pvg9/j82gAOnTyPzv3vo+fsJZy/8hU27zuCA++dwM
                    2bd9DfP4C+619JefPuN7Fu26u4cPkaPua2J5kHB7/B0NcP0H9jkPucweDd+7g39BD37z3Eva/Fkw
                    DDn0ODD6Ttzl/ox5Fjn+HLqwPo2vE2Ll78Eq3rd6GlbRsqq1ajtroFdZUrsTi/AovSirA4JQ+lka
                    lQTZ+PFJdpUDtPQfkkT1SR2Sod3FBhOwFLx05E0WgnpMitEa5vRiNrTN+iQABVwN/ABJGUxiCFBa
                    aTcSdT0ibQkDsyqhtrYwOnCRMw3u03zNPgHx6PpNxy5FY0Yfnzu/DlV09f7u4f6algEfNtz164Br
                    eZwbC3nYRxJtZwMzCFL2k+hlqbwF4eR61PIYhyqHWZlAs16bSEYZgATAV1spGgaKG5aiAdlhEcud
                    TRHOpkDgGXrENTSdQHcLtQSlY0fU02/UTpGDsUOLpI9x/ibcchdZwbCknpC4OSkOEXhyXpJajMq8
                    QK9vSlixvQtGIdOjt2YHPXXhw/dgo3+gZw9swFbOl+F8d6P5cKfv3Wvx6JGPz2O/z1b/+HPz75M6
                    7duYfHf/5B6hj9d+5j6OFPX8Q39PAR+u/ek7YR2z75EUWLOrpz/+cfZhNm8eGjP0nRz+A34p20/4
                    8bt+9h11tncOnaLfQP3MU7h0+j9/RFfPjRKXRteg3v0mSePHocTUua0MJyvlC9Ch2LatGWV461ua
                    VYm12K+oQclAQnIY8slRcSjxya0wy/cCnnhSRAHRyHJL8IRPmGIikuHcmqPMQwv7B1B/a+eRC5Na
                    vQtfe3uHj1BjbuP4z+P/z8g/NPBYtIYsee3nN49+ARlGSVQs2LyqRWq5ynIsNmPE2aLaINLBhSmi
                    FKS4EY+gTxoFMSQzLVSB3SpC6WMiKplikl9okjmKJJncny0ciycULG+MmIcSTtMsRNneyOKt9g1I
                    XHojYtE2WZahSlq7GhrQOHeP69rx3CiZOf4sVd7+D85T5c7ruFS9f/la/03caTPw2PbIvGuXz9Dm
                    4PDt8c+19NfQMP/vmu/PsPH+P7H/6KxyzD5b47ePDHx9Ic6C9Yzi+u32S+gUtXruPS5au4zHzxwh
                    W8TkC9934PDn9wAhu2HUDn5v3Y8vIBnDn9GTo37MHZs+ex9eU3caL3U+x64wjaWXdvHz+Lr+4M4f
                    a9b3GOILn19fA9oS8Ghqez/lx6Jlh+nPqu3cTB/e9he/MGdBTXopl0WeobjTjn6Qgf64ZQG1eEWL
                    swOyLK2oly4YwkG3tk87PYyQ2Z4yYjkt9Dn3NBqrs36uKy2Fsa8d7e/WhcVEldX4WdqzuxY81G7N
                    r6Co4e+xinPjmPofvf4Hs2vkC96MmfsiJ/TcNJsN4jguu7J9+j90IfTl3sw7Vbw41++vO+YRD035
                    WmSd5kx+m9cAPfcftH3H7wwU9Z9JekXwQWka4R5b0ff4bTROehA+9jT9ce7N+6F3u37vlR3s3czd
                    +78Srz69u68cb2buxj7mh7HrVVTVjd2ImXNryCg4eOszf9BTt2vYVjH/4ep3rO8djn0dt7AY8pE7
                    +m/730i8Hy4zREGhsc+umikv8u3adfeP3oabx+5CzeOHoOBz74BPup1W999NkvosBf0387AX8HKT
                    CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
                    </br>
                    <p><b>Dear ${firstname} ${lastname}</b>,</p>
                    <p>Please find the Login credentials for your account.</p>
                    <p><b>Email ID: </b>${email}</p>
                    <p><b>Password: </b>${password}</p>
                    <p><b>Enrollment No: </b>${data.enrollmentNO}</p>
                    <p>Please click button below to access your account.</p>
                    <a href="https://app.thetncollege.com/" target="_blank" style="display: inline-block;cursor:pointer;padding: 16px 25px;font-size: 16px;color: #000000c4;text-decoration: none;border-radius: 6px;background:#2289ffe3;">VISIT WEBSITE</a>            
                    <br/>
                    <br/>
                    <p>Regards<br/>
                    TN College</p>
                </div>
                </body>
                </html>`
          );

          // let config = {
          //   method: 'post',
          //   url: 'https://api.sendgrid.com/v3/mail/send',
          //   headers: {
          //     'Authorization': 'Bearer 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',
          //     'Content-Type': 'application/json'
          //   },
          //   data: emailData
          // };

          axios(config)
            .then((response) => {
              console.log('axios response', JSON.stringify(response.data));
              return {
                hasError: false,
                message: `Success! Mail sent.`,
                user: response,
              };
            })
            .catch((error) => {
              console.log('axios errrr', error);
              return { message: error, hasError: true };
            });

        }
        if (sendSMS) {
          const client = require('twilio')(accountSid, authToken);
          client.messages
            .create({
              body: `Account Created for ${firstname} ${lastname}, Email - ${email}, Password - ${password}`,
              from: '+12565619903',
              to: "+91" + mobile,
            })
            .then(response => {
              console.log('response,,,,,', response)
              return {
                hasError: false,
                message: `Success! SMS sent.`,
                user: response,
              };
            }).catch((error) => {
              return { hasError: true, message: error };
            });
        }
        return {
          hasError: false,
          message: `Success! Student has been created.`,
          user: res,
        };
      })
      .catch((error) => {
        return { hasError: true, message: error };
      });
  } catch (error) {
    return { hasError: true, message: error };
  }
});

exports.createQuiz = functions.https.onCall( (data, context) => {


  const { numberOfQuestions, subject, difficulty, currentUser, title } = data;
  const docRefSub = admin.firestore().collection("Questions")
    .where('subject', 'in', subject);
  // const docRefLevel = admin.firestore().collection("Questions")
  // .where('subject','in',difficulty);
  const noOfQuestionRef = admin.firestore().collection("zSystemStudents").doc(currentUser).collection('boughtItem').doc('noOfQuestions')
  const usedQuestionRef = admin.firestore().collection("zSystemStudents").doc(currentUser).collection('boughtItem').doc('usedQuestions')
 

  const noOfQuestionsRef =  noOfQuestionRef.get().then(query=>{
    const refreturn= usedQuestionRef.get().then(usedQuery=>{

      console.log('usedQuery',usedQuery.data())
      let noOfQuestions = query.data().noOfQuestions

      let usedQuestions = usedQuery.data()===undefined ? 0 : usedQuery.data().usedQuestions 
      // console.log('noOfQuestion0', dar)
      console.log('currentUser',currentUser)
  
      console.log('noOfQuestion',noOfQuestions)
      console.log('numberOfQuestions',numberOfQuestions)
    
      console.log('noOfQuestion type', typeof numberOfQuestions)
    
      if(parseInt(noOfQuestions)>0){
        if(parseInt(noOfQuestions)-parseInt(usedQuestions) >= parseInt(numberOfQuestions)){
    
    
          const SubData = docRefSub.get()
            .then(querysnapshot => {
              let docdata = querysnapshot.docs.map(doc => ({ ...(doc.data()), id: doc.id }))
        
              docdata = docdata.filter((item) => (difficulty).find(element => element === item.difficulty))
        
              let shuffledArr = docdata.map(a => ({ sort: Math.random(), value: a }))
                .sort((a, b) => a.sort - b.sort)
                .map(a => a.value);
        
              shuffledArr = shuffledArr.slice(0, numberOfQuestions).map(item => item.id)
              
        
              if(shuffledArr.length === parseInt(numberOfQuestions)){
                console.log("Inside If");
                console.log("currentUser If",currentUser);
        
                const myQuizRes = admin.firestore().collection('zSystemStudents').doc(currentUser).collection('myQuizs').doc()
                console.log("abs")
                console.log(myQuizRes)
                const finalData = {
                  title: title,
                  questions: shuffledArr,
                  itemID: myQuizRes.id,
                  type: 'quiz',
                  withoutTimer: true,
                  numberOfQuestions: numberOfQuestions
                }
                console.log("ttt", finalData);
                
                let finalNo=parseInt(usedQuestions)+parseInt(numberOfQuestions)
          
                usedQuestionRef.set({usedQuestions:finalNo})
                myQuizRes.set(finalData)
                return ({
                  hasError: false,
                  message: `Success! Quiz Generated.`,
                  data: myQuizRes,
                })
              }else{
                return ({
                  hasError: true,
                  message: `No. of Question are not available.`,
                  
                })
              }
            }).catch(error => {
              return ({
                hasError: true,
                message: error,
                
              })
            })
        
          // const LevelData = docRefLevel.get().then()
          console.log('result', SubData)
          return SubData
        }else{
          return ({
            hasError: true,
            message: 'Please buy more credit to generate Quiz',
            
          })  
        }
      }else{
        return ({
          hasError: true,
          message: 'You do not have enough credit to generate Quiz',
          
        })
      }
    }).catch(error=>{
      return ({
        hasError: true,
        message: error,
      })
    })
    return refreturn

  }).catch(error => {
    return ({
      hasError: true,
      message: error,
    })
  })
  return noOfQuestionsRef;
  
})

exports.wrongQuesQuiz = functions.https.onCall( (data, context) => {
  try {
    const currentUid = context.auth.uid
    const { title } = data;
    console.log('title',title)
    console.log('currentUid',currentUid)

    const wrongQuesRef = admin.firestore().collection("zSystemStudents").doc(currentUid).collection('wrongQuestions')
    const myQuizRes = admin.firestore().collection('zSystemStudents').doc(currentUid).collection('myQuizs').doc()

    return wrongQuesRef.get().then(query=>{
        
      let quesData=[]
      query.docs.forEach(doc=>{
        quesData.push(doc.data().wrongQuestions)
      })
      // quesData=quesData.flat()
      console.log('queryDa,,,,,',quesData)
      quesData=quesData.flat()
      console.log('queryDa,,,flat',quesData)

      const finalData = {
        title: title,
        questions: quesData,
        itemID: myQuizRes.id,
        type: 'quiz',
        withoutTimer: true,
        numberOfQuestions: quesData.length
      }
      console.log('finalData,,,,,',finalData)
      if(quesData.length===0){
        return { hasError: true, message: 'No previously wrong questions available' } 
      }else{
        
        return myQuizRes.set(finalData).then(res=>{
          wrongQuesRef.get().then(res => {
            res.forEach(element => {
              element.ref.delete();
            });
            return console.log('deleted')
          }).catch((error) => {
            return { hasError: true, message: error };
          });
          return ({
            hasError: false,
            message: `Success! Quiz Generated.`,
            data: myQuizRes,
          })
        })
      }

    }).catch((error) => {
      return { hasError: true, message: error };
    });

  } catch (error) {
    return { hasError: true, message: error };
  }
})


exports.changePass = functions.https.onCall((data, context) => {
  try {
    const currentUid = context.auth.uid
    const { oldPassword, newPassword } = data;
    console.log('....................', data, currentUid)
    const ref = admin.firestore().collection("zSystemStudents").doc(currentUid)
    return ref.get().then((querysnapshot) => {

      console.log("AAAA");
      let data = querysnapshot.data()
      console.log('querysnapshot data', data)
      if (data.password === oldPassword) {

        return admin.auth().updateUser(currentUid, { password: newPassword })
          .then((res) => {
            return admin.firestore().collection("zSystemStudents").doc(currentUid).update({ password: newPassword })
              .then((querysnapshot) => {
                return {
                  hasError: false,
                  message: `Success! Password Changed.`,
                  user: querysnapshot,
                };

              }).catch((error) => {
                return { hasError: true, message: error };
              });
          })
          .catch((error) => {
            return { hasError: true, message: error };
          });


      } else {
        return {
          hasError: true,
          message: `Error! Old Password not matched.`,
        };
      }
    }
    ).catch((error) => {
      return { hasError: true, message: error };
    });

  } catch (error) {
    return { hasError: true, message: error };
  }
});

exports.updateUser = functions.https.onCall((data, context) => {
  try {
    const { userID, disabled } = data;
    return admin
      .auth()
      .updateUser(userID, { disabled: disabled })

      .then((res) => {
        return {
          hasError: false,
          message: `Success! User has been ${disabled}ed.`,
          user: res,
        };
      })
      .catch((error) => {
        return { hasError: true, message: error };
      });
  } catch (error) {
    return { hasError: true, message: error };
  }
});


exports.onEnquiry = functions.firestore.document('enquiry/{docId}').onCreate((snap, conntext) => {
  const newValue = snap.data();
  console.log('omEnquiry .........', newValue)
  let config = sendGridConfig('ritik.crimsonbeans@gmail.com','noreply@tncollege.online', `Enquiry by ${newValue.name}`, `By ${newValue.email} - ${newValue.message}`)
  let config2 = sendGridConfig(newValue.email, 'noreply@tncollege.online', `Enquiry Submitted`, 
  `
  <html> 
  <body>
  <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
      <img src="data:image/png;base64,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
      CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
      </br>
      <p>Hello,</p>
      <p>Your enquiry has been successfully submitted.</p>
      <p>We will contact you soon.</p>
      <br/>
      <br/>
      <p>Regards</br>
      TN College</p>
  </div>
  </body>
  </html>
  `)
  axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return axios(config2)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return {
          hasError: false,
          message: `Success! Mail sent.`,
          user: response,
        };
      })
      .catch((error) => {
        console.log(error);
        return { hasError: true, message: error };
      });
    })
    .catch((error) => {
      console.log(error);
      return { hasError: true, message: error };
    }); // access a particular field as you would any JS property
});

exports.onFeedback = functions.firestore.document('feedback/{docId}').onCreate((snap, context) => {
  const newValue = snap.data();
  let config = sendGridConfig(newValue.email, 'noreply@tncollege.online', `Feedback Submitted`, `
  <html> 
  <body>
  <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
  
      <h1>                                                 </h1><br/>
      <img src="data:image/png;base64,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
      CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
      </br>
      <p>Your feedback has been successfully submitted!</p>
      <br/>
      <br/>
      <p>Regards<br/>
      TN College</p>
  </div>
  </body>
  </html>
  `)
  axios(config)
  .then((response) => {
    console.log('Success! Mail sent.');
      return {
        hasError: false,
        message: `Success! Mail sent.`,
        user: response,
      };
  })
  .catch((error) => {
    console.log(error);
    return { hasError: true, message: error };
  });
})

exports.updateStudent = functions.https.onCall((data, context) => {
  // try {
    const { userID, firstname, lastname, mobile, status, sendEmail } = data;
    const setData = () => {
      return admin.firestore().collection("zSystemStudents").doc(userID).set(data, {merge:true})
        .then((querysnapshot) => {
          return {
            hasError: false,
            message: `Student's account Updated.`,
            user: querysnapshot,
          };

        }).catch((error) => {
          return { hasError: true, message: error };
        });
    }
    console.log('<sendEmail>',sendEmail)
    if (sendEmail) {
      let config = sendGridConfig(data.email, 'noreply@tncollege.online', `Account created for ${data.firstname} ${data.lastname}`, 
      `
            <html> 
            <body>
            <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
            
                <h1>Welcome to TN College!                                                </h1><br/>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACQCAYAAAA4CJinAAAAAXNSR0
                IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAJweSURBVHhe7L0FeF
                TJFi0c7066O+4eIMEdAgFC3N3d3V2Jh5AQCO7u7u7u7u7uEBxm7l3/rhNgmLkwwzDM3Pv+9/b31d
                d2+pySVWuvXadOlRj+n/0/+0b7f2D5f/bN9n8lWJ7cuYejazbjxKrNOLlhG3av3YSdm3di85btWL
                V+M9Zu2IoNG7dh9doN2Lx5Mw5s3Yb99P7JvfsfzvB/p/1fA5bbFy5j17I1WDdjHoak5CK5iyWSWv
                dEfMc+8GzfHb3adkD7dh3QrkNXtGnTiUvt6bueHTvBo3N3hHTshvLgUCwcMQLrZs7E6f0HPpz5/x
                77/yVYfv7pJ5w5dBjbVq7C5iXLsH7eQhQGhMO/fQ94m3SAm6YRnGWU4SGuABcZFZjyFaEpLg05GT
                54ckKIi0lDQkwCQj4PmrI8dJEVwl5OAV4CRYRpaCOhmQmKLO2xceosrJ8zHyvnzseW9Rtx5thJ/P
                zzzx9y8f8/+/8FWBqfPcP506dx8vBh7N26FYunT0ektS1sDZrBpXlLOOg1g61OM/RR0YapUBFm0n
                IEEnkEyCjBg6cMd/0WiHZyRVRYOEKjIhEeGknvIxAXGQZf675w0tWl4wQIkOIhTJqPKGkBQsQF8J
                dVg52iJnpp6aGHSSv42zhiyZQZOLp1Jy4ePo5rp8/ixbPGD7n8P9/+jwVL46MnuHXxMi4eO4FJNX
                WItbZDcPeesNbTh6mSMropKMJcSwcJ9o7YtXYdDm7djv1btqE8Lg721PjOIkX4yCnCS0kDA+IScf
                PSJdy+dQu3bt/GnTt3cY/SXXo/bXgDAlu3hJuUNHzFxBEiKY04WXmES4vgJi4HG5EK7Ilp3Lubwq
                VjF3g0a4swk87I7GWLbDtXTB0wEOePHcPNixfR+PDhh9z/n2n/x4Dl3//+N54+fYr7d+/i9rXrGJ
                VbjNTeNggyMIGbSBVOsgpwIFdhzpODqUCIiL4W2LxyJc4ePcL996Pdu3UTE6rLEda2NZwFIrhraW
                PBuLHcb+y4y1eu4uKFi7h88RKuEIAGlxbDRVcLzhIS8Kbkz+MhRKiAAJEy4jp2xqYFi7Bj9RqcIg
                1zZPsO7Fm5BvUhUQhQ04OHvCrcVNTgZWiE5N59MD4rGw9v3sTjO3fw8snTX+Xr/wT7nwfLv//1b7
                x68RJ3rt9ESVo2Ih1d4N6yDfpQQ1vJyMKekjtpCi+hPFwp2QiFiOzVC4e3beMa483LV3j66DGeUK
                9+9uQJ/vWvf+HZw/uYW9sfAYYGsFJVwdxxY7hr/URax7h1e2gpaKAV6ZqWmtpooSCAuUAO7tLS8J
                KQhIe0DFwIjCm9e+PAuvXc/5i9pjx+bPzbZ89hSHAYojV1EKGiCm8eH+6UPBTkkdm9G0qI7SalZe
                Hh9Rt4++IFlfFf3P/+1+1/FiysUd+9fYcbl66iJjEbYd37ortACTbUAB4GBrBXVoSdggh9ZKRgwZ
                eEjZw0zPlSsFdTwfxhwz6dY0ppf7h36AHrFm0RZGGDG5cvc43aeO8ehiYnwUxZCTPHjPx0fGlJBY
                rSclFTUAYvcyu0JXdmL69E+kREglgKDlIy8NLXx5Lx47j/sHO9ogYfnpGNB+TG3r95w313afduFL
                Vvjwi+LKJl5RAuL4S3PB+eIlmEq6ohSlMXeT16YXJyKu5euoz3b9/+z4PmfxIsrNEun72AqrQ8eH
                YyQ08RCUl1Xdjr6GBsTg72zpyGASH+sFRRRE+BJPoIJWGlwIcFNYaLvg5WTZncdB6KTIJ69EU7Er
                JdKHWSVUJZbCyePX7E/X7q0CF0o4abNnIU9/m3dmjzVgSZ9oIdXwGeEgL4yIhgzxcixrwPLhw9zI
                HiHTWyhbYOrJTJFaqqY3xMFF49fYLGc2cx3sEBIdI8BPBkySWJKExvhyo/Xwzy9cewwGBEt24NFz
                VVRFPIPjY+CbfOnOEiuY8M9b9m/1NgYZXE0q4Nm+Bu3BrWfBFc1LUQYmaGyrgY7Jw399Nx62dOhG
                NrA3RXkoGprCR6ykiit6wMHHW1sXDMaO44BpZQK1sCiSIcRZqw4SkizcoeD0kzMDt++AjaaRti6p
                gJn679eVo9bxGcW3aAk0ATvjxVOIiRoCW9Mm/kCO7/rGEHhobCTFIC7kpKcOTLIL21CbmXa3hEof
                t4Et2+BC53TS1UUqR1klzj57Zo9EiEdu0AH2I3H9JCcc2NMDQ6HBcO7ueu/79m/1Ng2bhsFezbd0
                E7WQG5FlmEkmbYPHXarxqQ2aSKEtg000JLGXF0FsrATMAjYUuvFLHYqKlhwagmpmBg8aAopTNFL5
                5KWnDiKSC2iynuk8hkdujgQWirqGPymIlcw88dNwNtjFpBjXSGvpYWdCkPLcWlYU8gY2Cxl5CDA2
                mclR+Yi/1nSHAonOUE8FJUgiuBxY/SgC5dMbK7GbLVtBGsqoHVU6b8Kv8fjX0+vHYl8ky7IVIkjy
                DSQ648aUR0aIMtixd8OOp/x/4nwLJp1SrkhkfC0aQVeomU0ENagF48AVZMnvrJj7OGmdOvHAUUjr
                qpaSKgeTP4UE+0Iu3SS0oSfSWlYCnFg4OiKmYPauD+w9xZiqs72hKI7IkRnOUVkGNrg0cfmOUouR
                IjYqJxY8ZwDffm9WtokAiVERODSFwc6vTahpKznBwxhBwcxSWIoeSxeExT9MTyVOPhC3eBKoK1DO
                CvrIYMIxPUtuuCUg1DJFKEtnXKr8swJiMDFb6+mJSby31m1923dAkSTFoiQEoO0TIK8JeTh59xM5
                REhmLLkkXcf/8X7L8KFlZR8yZMgHfPbjDXVoOZUJbYQQrmknxYClWxcdFS7jhWqTvmLYStqjYSOn
                bHnJQsPH/0CFvGTURUi1awl5aFA/3HSoz0CwnQpD59cW7vXu78b0lwFoeFIrhTOxS7O+Hu1Svc93
                dv30JKTCS01JQJLE1ui0VDKuqKkJESgwpPDMZ8MXSXEYObQJqYRQpuYgQWaT6BcTB3/M8//YxhsQ
                nkhvgwJwEcZNgcdy5e5ETurgmTUUau9MyGDdyxTMDOr6qAL2mbKB1duCopYuGwQXj/7h3HgEtHjo
                a3uBzipJUQr6AOb3UV2FJewrt3xryGBhxZt4UD/3/T/itgYZV8Yt0OzKtpgL+hMaxFcrBWFcBJSx
                n21LPZ0HpfviJyPANx/dxFrnGfP36MibW1ePH0Gd6/esV9d2jWfCQbtqIohcJnMT5pCmn0JcA4KK
                ugJiICt86d4Y57/fIlnj99ilfPn3O9/On9+xhbWYXOevrQVlTEmJEj8dPPP2HawrmQVpaBuFAMPE
                kx6EuLwYwA40juzkdCHN7EMg7EOAmWvXHy0D7u3C+fPcOovByURoThztWr3Pnf0vnnpWWgf+9euL
                p/L1fmV42NiDYyRLCMAEnKmvAk0Ts8MQrviM2Y7aSOEUQMFSopIGCSINZUgl9zXdjJ8RGoa4gie0
                86ZhXXcf5b9o+DhUUPK6fNRVJHS/gKteAnr4p6VxdcPHoEa8aNxABvLwQbGMNcWh62KvpYOXUW9z
                +u0QkkzE7s24f1c+aizM4F4Ypa8JUScWBxpR7uSCxjRb3fU08PAxNicPbIQe6/zB7ev4P9O7ZiUE
                EBbKnXG9CxqjKysO1rg+qBdTDq0hZiAnGIicQgSWDRpWRKLONMKZhC9AByd04SYrBT4SMr0BVXzp
                7gzs1A2PjkyafrXKYoqrxbDwywtcat40e57xioPEiLxfKVyT2pIoDE+/jURLx70wSWXQSWEGIUP2
                KoqBZGWDh4AK6dOoFh7p4IkKfv1YxIy/TGssmzuDr8b9g/Bpb3b9/hyrFTmDtqHBwNTGBDFRBu0h
                aXjxzFUxKcrKLfvXqJx7duYlZNHeyo4kwl5VAQHI4HHzQGO+bYnj2Is7SCq7YeQvSao6y3JSrMrR
                BGn+0lpMgdScNBQhruVOkh+gZIszDHxgXzsW7pUuQnRcOuc3t0VFVFC9JE2hI8KEjIQE5GCHHqzW
                IUTckoykGMGEUkLQ4jAkZXcTG4yEgjkAS0H0U9XgQcd6E43DQE6OftgIPr1uDygf24few4ru/dj9
                Or1mF2WByy1PQw1MYe906e4PL+8lkjfJQ0EEhuJlRKGaHKOrh64gTnWl7df4DpKZnwlhUi0qQFlo
                1owOvnjVx5H128hIyW3UgXUTQn1IAjCfA54yfi/Kkz3DjUP2n/CFjev36DQyvWIc/aFdZK6uhOYW
                JoD1OcoWiEVcjDu3dw4fQZXGf3Z4jKF5L/DmrXAb0VFGCpr4uFU5uiD0bxZeHhCOncBVsWLcbpPX
                tx89Qp3D59GlNKS2BJrsKORKgHASCIJ49QOUW4E8tYUGO34UvDSFYKetISxBiSMOQLoEO9WyTJA0
                9aDhIyfEr0XiSANLkabT4PLeh8XcQlYUe/eZPA9ZWWJsCI0bklECQjAT+eJMJI8+R1aIfqHmbo36
                o9KhS0US2rgQK+Kmo6dMWlXbu4vL99+Qr17v4I1zSmxjfFMJ9w/Pz+PffbmaUrUNyiDUI01DCzpp
                KA9YT7ntm/fv4XSizdKCJTRV8Sv93khOiqroZwO2dsI2C+pbr9p+xvBwsTdgdWrEZuLxt4K6rDma
                ISK0V5DM5K54Dy7NFjFMXGw6ldV4SY2yE/KAxLJ03C3vXrMLK8BGZ6GihLiKeeRnqDjj976CCObt
                /+Sey9efGCE63T6mpgSYBwlJGBD7FGiIwI4aR7PMnN2BA4u4v4MJGVhgE1sBa5E22KcNQFQvCJiS
                QpPJYkUEmxROAQiktBl85hRO87SfGpkQRwYTcdeXLwIZEbRr8nksuLJSaLE8rDn0AVSCmZxHUVhe
                eDSXtUyVNkRGHz/MpKTq8wEXv3xGkcWLkOp7bsxP0zFwj8pHmePMWivCLkEkvOKirEk/v3uHJ9NG
                5gsaMZehJQgtp0gG/nduioLEQnkQgRva2wY/lqro7/CftbwfLT+3c4sGYVCh3syeeqk0ZRgJdQEV
                Fdu+EcNTpr/FFlVWgtVEdrcUU46LfD2Oo6NJIYZfbs6RMMLMyBh4kJ1k6cyH330ZhobaSIaOGgeo
                S0akGMJURfciP2fD586DrB1Li+xBw2BJ4ukuJoKyOJ5hTRaEpJQFlaCkokHIWyfPAJSEKBCAI5EY
                R0vJDApURMo0NhbzO+PNrJKqInuUwbRU0KoZXgSQI0TFyIRDER4klYJ8kpI5xAEs2TRqZADqU8Pu
                pFiuivpIIEOVliEjXMHVDF5fXdB83FjAlbJtqn5RQgSbsZanr0xd0zZz/82mSsfm5cu4YOmjoY17
                8WB9avx571qzBr7EjEWlnCiVg6rY81di5bgZ8oqvq77W8Dy0/v3uPg8qUosbdAiI4aAlWU4C9Sgi
                v1+MrAUI6CWWXkRsejGTVsJxlVLGoYy1UiU/wfJxE9ocgivGNHlAcF4S1VNqtwxiZTqBcmd+oCT0
                UVOJKvt6ZG6ishCRspHvl3NlFJiahbgG7EIiYUjhvyZaEtUoCOigpatmiBVm3awLhNW7Tv0h29+l
                jCrJclunXvhW5dzdC1ixl6de8D2x5WcOhqDufOfRDYw4bcnzn8jNojUK0FwoR6iJDVRCS5m3DSPJ
                F0/WQCX39FJQxRVEYJfU4jgMYqyZG2UkNat45Y2b8/x5CvKf/zaquR3ccC/hp6SGvVGTuGj8E70j
                WMMT+WnQlZf3cXDKsfyNXV57aVBH6ggio8hcpI6N4T2xcs4sLwv9P+FrCwwi5sGImMdm2RpqOCFK
                qsSG1NeCuowEZCBB+D1tizaAVXAdPHTUA7HV10Fqng1pWrxEbvsZnEKLtvw+wFRRklLk4UQgpQZW
                mNQdb2SGWTlZS0SHQqIkSgjgCBGrxklOAmowgXnjKBRwVWxAK9iMV6qqqjh1EL9Olhjtj4VOQUlq
                Fu6CiMmzYL0+YtwqxFyzGH8jJv6SrMWbwCC1dvwAJKc5auxmLSWWtWbcGaxeuxeNpizJkwG1OHT8
                Co8noMTe2HgYFJVK72CCadEixQRKK8EvIp4qkmPTSAwFlGzJKmIEeNKgNPkTSClBURpKpM0Z42rE
                UysCUW9FDRxPySarwmoDBNdo1028lDh7mys3GfxfNmcO8/NwaoTSRyo6jOQoj9fKljBJPwnV03hH
                Nbf5f9cLAwAEyqHoQg43bwosqIVOBjYWIkNlaWIoN6QC8xIYW17bBp+i/D2TmJ8eihpcG5Gyd9Qw
                R27Y5zR49x53p06zZiW7WGCzFGMLkGHzEpeItJk06g84jLw1FMAHtyCbYS8rCUVIAF9XQnbWNEmt
                ujMjEDQ0srMaC0P2YtIN/+g8coWMMsqBuLeSW1GB6ThLze5kjS1EUagTSXXFsKCWY/MTGK0lhEJY
                ZA0lRxSgoIoPfhKkICNg+J7bvgKUVDrKwHd+5BYWwKrp6/8OEKTfXJ0kdj7/fOXoBkw5YI5gsRLq
                cAf2kRd9/KXd0QM/oP/tXxP9J+KFhYJldMnYEY077oS9GDnTwfo2IC0Xj3Nh7duIFCD08Yi1GEwV
                dAWWTSh381/W9YWQHcWjdHkmVf3Kbexb57/vAhxobHUAQihyAJEpfSAtgRWCwpgulE52lBDWFAyZ
                Ded1fShH83S+QExmJIcQ12btjOnYOlpSs2cWzH3v9o+3gNlvbv2Inh+YWo8A9Eao8eCNDRgqOQh7
                4UQTlISCBGII9c0jL9lBWQIicFVwJRVMuW3CDhFRK/WX4h2LZuw6/yyd7vXTL703c7psxEpkknBM
                qrIliN3JtJS2Qat4WvSBVeqvoIbd8Ti0ZP/tU5fpT9MLAwCt09bzFS+tjAS0UbnsqaGJeQiEZS9w
                9vXMfQzExYaOuhF4myXgrqcDBojrn1gz4VilEr66ksse+e3bmHCUmZCFTWhq+YDLxJj7DZaY4UfX
                Sg90YU3hrLK8C0uTH8KYwsSc3DxCHjMWfqQhzYd/RXlcXe/17lvXv7GusWjMf6+WNwaN1cbJ8zBm
                vHD8KBhTMo0vj20JRdgysHpQsnTmFQdi6iLS3hoK0FO54slYF0DLnHWlU1pFP0FCArDksS28Ht28
                HFqBmi+1rjwtHjH85GkSS55Mm1Az7lf+/SRcjt1hNx6rpIatUGZ/bs5urrxd17mJuUATtZZZjzVR
                DYpTdWTZvH5eNH2g8BC8vw8SVrUGBqQ/TYBm7SsliQmI6XDx7iwZWbGF3cH30NycWQUF23YC43lm
                JHUUIE9apFVVUc0D63B5evYEJkAmKU9BAgJYI/RSnuMnz4kZi1pd7ZknppFwNdeLs5I7+wEMNHjM
                Gli5c5H89uJfxRJT29dgOn587D4QmjsWPEAKxryMPcYl/ML/fDogo/zMt0xIxYS0wPt8TC3DCsGp
                CNPVMbcHLpLDy5fvXDWX7fWJmY/rpB+RpbUIEylwCEa7VErFADOSS8C0Sy8JeUgCtPDB6kX2wopA
                9t3Rqndu/mhPyqidMwa8ToX4nWUfHxiNfSQmZLY1w6eOBTORmQXhILT8vIIxdvAjs1I7i36o61s5
                dw9fGj7IeA5d3rNygzs0K6qiFy1Q2wMDwCr+7dx70L11CfWYE+hh3hR9HG1hUruQpkM8tcNVXgRN
                GDh7IyRmfnUeVMxApK02sGoMLFAwlK2ogmPRIqIYALhbJWPDnSIwK4NzdBhKMjinNzcPPmDbym6O
                kNRQ3f0otunT+NvfNmYnlOKuZ5OWC5vx02JbtjZ7k/ttf6YkWpHaandsLKPHPsLnPBpnRrrIrtg5
                Wx5lSm3pjhZ441Bak4v3IJnl66+OGsv28MNGzg7OHNO5ieXY1BLoHINTRGvIIQoRTuu1HE5EyhvZ
                24GJyFBCIXFwyKT0JSd3MsH9I01YKBYef0OYg2aIHSHma4duwo10GZPX38CFtXLcftixfwjOq80j
                8EVrLq6EvJv4MZti9fw9X5j7C/DBZ2h3XN0AZkKSuhH/X6Ki1tHOxfhn9RBtkQ/5xJMxHtHYwtq9
                ZwvYT1mhkVFXAjoRfVygQVXp5w1tVFQMs28NIx4ELBUBKycQSQeBKyoRKysKVwuy+5NvdO3VCclI
                Z7d+6gsbFpOPyPjB3z5NJlnN2wFrOTQzDKuh1mOXbAujAr7Mv1w4nBMTg0JhKra52wuNwKM3O6Yk
                F+d+ys98Cx4ZE43hCNA5X+2JJhixWB3bDc0xTLfa2wKDEEVw/u+XCVPzaWj9eNL/CU3OvM4jIkkq
                bx0taBo5wIjuSenMWl4SQpRWG/HLxEQtSHhOLN8xfc/04uWY40447IN7XA9RMnPwHlPrn4mn5F8D
                LribULFnDH3r9+HcGGreAgJY/eVIfJFD2+ePaMO/6v2l8CC2v8/YsXIk9HDZUiHvpLSqKSQsVhDn
                1weV+TP3354iXu3r7DjRm8efkSSxuGIkhJDbkWFrh14Tye3LmNJCcHOKtpwZVPoSWlaJ48oiWkEU
                HaJJR0Smirrkj1CEZD/4FUQfe/CSTM2HE3Tp3GzMQkDO3VGWO7G2KulSE2hXTDiTJ/PNyxGHdPbM
                aKQZ6YWWGF9SP9sW6IF0antsGE9M5YUxuAA6NTcWhoLA7XBGBvqiW2+LbHMjtjDOuojtmx3rhx+i
                guE2P9mTw9f/IENy9fxtDsQoS0M4WtHLlXEvDO0mxitwx8ySWV9+mJEyuX48q6taggNq3vZY3rxw
                gonzHoq1cvMWXUKHSnDjprbNOkc1bnQ3wCiK14cJUTUoSkifWzZv+Qm4/fDRY26HZs/UaUdO1CjC
                KLoXIyqKfIpFaWh3iBDGocbXB5//5Pt9TZkPTmefPhTgK31MEF16kRWcU9uH4NsX17wU2ggAh5DU
                QJVBEiJaAwWYgIDU2kdTVDQ0IOlkyaiwf3v/25G0b/l06dQrWnN/Jbt0RDGwPMNTfBzoheOF7shv
                Mj4nF27RTsXDmZNIUlVowMxt7paVg/PAzjs3qgIbodagI7YGqmGy7vIprfOg0nqr2xPaIzltjpYW
                IPTUx2N8WweG/E+zvj5PFjf1pQPr73gATsMIT3toODlhG5WSEcCCyBcnzE8CWRLsfDKMp7tZ4B7h
                z+RbQ/uncPd5hGI+Z+QQy7b9t23KFokxkDy7DAQHLxctxdbieeEFHtumDPyrV/edDuu8HCHmOos/
                dAGrmMwZTGSFGYTGHtCBKjmWKSiCJ6rbJ14vwoM+Z+NpGoHByfjItHmgrOgFLi4QwboRzcxKUQKy
                LRK1SDN0UMwYbNkefohoXDxuD6mQt4dPfbgcIa7cyJY0hxtkeEoR5KTJphQncTLHftgqOFHjg3Mg
                r7R8ZhdIo1stybY/7wFDy4ehh3z+zC+hEJuHJ4AxZXBSHLUh+5di1xctcaNN45jzubJ2FfniWW+x
                hjpl0zjLBtTdFfS/RuroFgT3ecogjozwLmIQHm2P7DGFRUDlsKAiwp2vMVCBAtw0OqlDR1RAGGGb
                fCKwLDOxKxD69cxfDUDJTaOOHM+k34+TMAsA5yldwUeyjOhiJFZ+pwTpLELvJaSLNwwsGtO0m/fP
                9Y03eBhbHKvqUrkE3Ku0qkjgkCdYwX42MSCdLRkgooFZNFsqQc/GUUsJuOe/H0KYd4xi6NBB4GlE
                e3bqLYzoqiG4oESNy5EysFSsnCR6iCgOatMCy3EPs3b8PTh48/XPXbjI2nnDxxAk49u8JJTx0Zzf
                VR39YIk8wMsSG8B64uG4HLq2qxdIAHKoklqqK7Y/vioXj35iVV9s84OLcMb18+wcaRaRgYaIp0cl
                v9Y01x/9Z5vH/xGJcX12FjQjfMcjFBUTtFyqsC7Ey0YNO5I+x7W+PEdz7vzJ6AHFJeDVfjNtxtij
                BKGcQ0OQSYcnlFrHF1x7qgYBSatEQQfQ4QKqCiV18cXUb1+/gxd0PyGrF1eKv2MFNRglfbVphTW4
                8cdgNXXhfuikbI94rE9YtXPlzxz9ufBgtr9P2r1iKlZTtkKKhioII6RkiICCxCSiJM4mmiSlyITE
                kRYinu96JU4OyOc4cOcf9lQHlMGqbS3Q12bIKzIkU4UuJwJ8C4UXjsqWuABgLKw7u/vvv6LcZ69f
                GTJ9C7tym6aCoiuJk2atuboKGlJmZa6mFHuhnePX+Eexe3YkJRT1REtsOYfAesHJtOFb2T65mHFp
                bj2r4FmFHkginpTujn1Rpp3rq4fvkYd42X969heXxnTHZuhn4dVRBqogxrfSW0I4HfXFEDZu3JzR
                39tbb4Vnv04CGGE2C8mrXmhvDjiKVTSbeVEksXyQmIaSQQT9FTGKVAnjTcpKQQpKmJUksrDHByRW
                zL9nAnRh5dXYm182ZzeTi1fRdyeznATVoLAbpdsHPZeq4dvsf+NFguHDyCfEtbRKiqoFBHAwP1dD
                CYBGuDtDKGSqhgqLQaSsTlkEVgCaNXdykRLBVUEOfkiMO7tuMe0Wmlrx/syJ+6SkvBjcJGVwKLEx
                XeQ18X9VnZuHPz1if//K3Gjj92+hQ6mZtBW00Eh1b6iDPWQ42JAca218NMa11sSunKgeXmqfVE5e
                1RGtQGIzPssG/1ZA4oLJ3f0xRVrBtfgPFpzshxNkaWnxFuXj3JXefl/etYldwD09xaoryrJkJbqs
                BCWwHtFeXRUlkDWgI1mHY2x/Hjp/50GZg9ffQEI4rKEEAuKYDce6K0AHnkToopSsqhOkqTlSI9I4
                5AGepgMmyylyTspHhwkVdBcJsOWDJ2/IczNXUeloeDK9cjsV1vOEprI7OXB07u2M+V9c/anwILu/
                DGGXMQqKKKCBUhJnhY4/6MsThVW4XBpmYoEmqgXKCFMllVZFHoFiWtCB8SrKkWNohztIdFC0NY6m
                jBgj06QRTLHr4K4Muit4QEAju1w6DCHDxvfIYbdx/gHlXan7GL167DLiAQ8pqqaNtCF9aGmvAj0F
                Qb6WFkaz3MsDbEwWI7ciVP8PjSPszIsUWVdyeMjnfB/MoE3Dy6/cOZmsq5YWo1phWGoTbcCkNSLH
                D/5nnut1f3b2BVbE+MsjRCQXt1RLSn8NdEB910tdBaQwfGGgZQU9CEk1cQzpAI/R7AsEdhZ9U2cJ
                PT/aTkkCZQRLq0NOLJVSdIiyGCLwZvnhgcCTj2crLwJjYu8PDE1sWLP5yhqQxr5s35NMayesZseC
                gbIkinHUoCo3CaXPWftT8FlkOrNyOxdRduimGRiTZOr1rMZYqlf1HUM93LF5mqesiWU0U2VViQjC
                LiTTqQQD3LhcjVYcHoLiUJF5GIe7jcj3qEK3t8g1hqUF423rxumoj9Mf0Z27prNwR6upDXVkVzXV
                X00lZBiJ42CnR0MaK1ESb21seeTGu8f940V/bG8X1o8OmF0VGuFO38cj+Gve5dOgozquNQFWKLLP
                uOJITt8eT2Ze53BpY10X0wyrw50k1U4W2sAfNmmuhIYGlB0ZuBijZ0VHQgr6wJl+BIXLjWFKX8GW
                N5ePfmLTeh3ZGJfQJLAoXBsRJiSJSTRIQsaTwCixWBxUFDDevnzOH+83kZ+qWnoQOx/isKLJgd2b
                oVMW27cHflYzqZYsea1dz3f8b+FFjmN4yCD2U+TkSUqMrH6D4dcXPzWu43lkHmCw8MG4bhVraIUd
                JAhL4xbpw7z/3GRhiTe3ZHXwmiT9IqISJ5eFAEZU8VUegfzE1m+ljYP2s79x1A2559IKuuCmUDTW
                iqiNBJWZ56nA6StPRR28oEY7vpY2NQN9wfl43H8/pjVaY3auw64+DyhXj59DGmV+dj+eSRXB6q4t
                2Q59sDJQHWyLbvhOGRFnh84yJ+fnQHV4fnUDTUE4O6GCK+mSrsjdRhrC5CCwKLHukHXRVN6KvrQl
                lVC4btOmH91l8Y688Yy8fbV69RF50CB2JnJ4oWk9XUEM2XRoScNJykJZDRtzcuHDrwxXpjLsjTwh
                yhjrZceM2O2bt8BQKU1eFKAjnTyQHnDjZNA/lW+2aw7Fm5EUldLBAoJ09hnTTyBDzUUSWN6tYBGy
                tKcX83CUTKEGMYFv/PLirG5LQMTqk/u30b41OSKZMC2EmKcQX1EAngR72+yDMAUwaN5O7rfI9dvH
                oTPuHxkNPUhYg0j4qeJvS01dGRepylqjoSWrRDPxOKrtrpYoNnN1wp8ML1qjDMDzLHINeeWFFXiL
                0LJ2HHwsmUh6YJWZvGlWHpwFQsGZCJ/oHWmJrqRqHzFQpfL2Jvsgdm23RGZUs9xDTTgkObZtBQlI
                WiohD6BvrQVFYlwGhAT0cfqtp68A2LxvnL33Y/6bfG8sJWgRgYnwFXNV34iVRI3MoRs5AWpJRPrv
                3muabZda/puFEUfk+ubXqmidmg/Fz0ovoYUV6Al88bcWHvHuR27AAfYnZfHR0s+/Cw3LfaN4Hlzs
                VrSHfygxOp/QDKZAq5oWpZYhbSHsNIqQ9gj4Ba2ePEkiWfUM4ecWA9gwmpU9u2IVpXH64kxpxkJO
                CkIAcnLXXkeHli+pAxVJDvZ5WFy9fAsH1XiLR1oURgUdRQhrqKAporKKCHmgb8m7VDIkUI9a10Ma
                2rLnYH98KZIj9szPLGpFhXHFgxB+8prz+9f0t5+Beu7F6L969f0nevCETjMCUvCLfOHkHj9TM4Na
                k/lnqZY4xpW1S2a8U9CNZOXRl6uhqQp1c1LQ3oqqlDnzSdDrlWVVVVNKOocc6CJR9y++eN1QsDQk
                1sOlyV9RAu0ECkrBLcSPM5k9s9sHULd9yLJ88Q36UvfJt3wLIp05uA9vo1+kWFUzhugBFZKRgSFo
                QobU0ECAQIUFJGrgO54FNNWuxb7JvAMmfoWDjpGcOB6QwZGSST7qiRksE4KQGm8JUwgqeCStIp1R
                27YtuMGbh57Min0PHulSuUyXD4ywjgTf+xI6D1VSEtQzQ4bcRIvPhw/+N77OadewiLS4M8uRpFcg
                EqWmpQVVeCNoGlmZIiOhKIu4nUEGJgjH4kdEe00cF82zbYluyMtflBmJ4dhLVT6vH0QdOzz//618
                9Y2z8Jtw9uwp1j27FhVClm9gvHniXjsH/OQCxLc8XwPm1QTCF5jnELuGlpoxmFzLqGelDS1YSShg
                p0CSAmxGp65AaVRHyoEXii4pJw7eZt7hrfY6x+nj99hmK/CPjL68JHUp4iGzn0JnFbFBbK3Tpg9X
                3xyHH4a7WEv3EHnNy0hfvfuOJCWCmI4KgkhJ8mRUyUxxDKM3tENkC3BaYNbFpu5Fvsd8HCLnbvxi
                0k2LvCWV0bfkpKCJeVJbBIoZQafgiBZRSFxiOlFFArrYRsWWUkaeujv4cbjm5cj2tHj2BydiYiqd
                FCJeXgTcmSMunYph2mjBqNZ0//2upHs+YvQ4u23aCgqgl1aiBNdUW0bq4LF4ueCCZfbdexI5rxBX
                DUMUKCrhHyiXlqujTDMJeuqHLrSXrAg6KOLGxZOAYvHt0lFvwZOxpycWxcEVZVRGNOUQzGZgajOs
                ICVaGmqPHqgn49jJHaXAchWlpwIrY00dYmkKhBRYfyQGDVU6IQWkUeBop8GJPQtujTA/GJKdi+e/
                +HXH+/Pbh9B4XO/nBkYJERwpLHg5W8CMNT07j1Zt6TKB7kHkgiVhH9uvXFtllzkNy7F2wIVBYykk
                g17YzNUydj0+TJCFJi2kUTSY5+uE2u/Fva4Q/BMnFAA1VKM4pgFOBPsX6YHA+R0lJIJbBU8AQYSJ
                lukGTuSA2lsioob9YKB1avwWxC9AAnWyRQRBIhI4toaXl4SivAVtsI9f0q8ehh0xop32tPnj5HQl
                o+NHWbQ520iS4xSs/2Jhg6oAJ7tm3GoOJshDjZwVBBHj1JOwQYtEaolgES2zaHP0Vy3u0MURXtj2
                WjqrBydCmOrJqKx9fO4/i0WhwcX4wJyW6YlheNmWWpSPPqDrcuyvDuqIqwDloIMdbm1lXpra4JI2
                I0RRVlKKoqQ4fC9ubUg7voKMO+ayuMHzEIq1YsQU3/SsxftARPnz3/kPvvtwXDx8NVwwg2PDnY86
                RJA4ojSt8Au2fP5lz+jSPHEEEgYBPJA+QUYS8pBUc+H+akM6v9fUioX8eD69cR37oTrNjKEDptSe
                vU/TWwsD8/ffwU8dau8FTXgY+iAmaXl2JSWgJyOrdGgoYqciiiqaZopp4YY6icCioEylgfGMZFRY
                dnzkZRWxNEkJiNl+QhnljHR0EXQb3tsW3jjg9X+X6bvWg1WnfqDQ0NXdIJqjDWVMKAfrl4+ughF4
                IPLkpHqJsNuQMBWpM+stBvAVsSnXZGWuhtpIah5YXYuXw+Nk4aiJ3zR+P+pZO4fWo/to8vwJqGeE
                zK9cCC6lRc2L8VkwbnwbWPDmw7EwjaKsNcW4A+akroQtGJjrIKNDU0oKwoj3ZGurDv2BIxjn0wIC
                sSe7euxp6dm5GSEIHw8HDMXbDsQ+6/3+7fvIPi8GiYC4VwYM9g8yQQIhRgfFwcnty8gQcXLyJeQx
                /hJA98qV3cJGQozJYjZuEhxdoK10kQMy25ZPR4mMqqobeiAcJ7u5IrfvyHgPkqWJgPnDx4PKzlNe
                BFIja+mS6ePbiPV08e4tTWddg6YzLmZmZgoFFzVJNrqZFTQLmmDhp37uYuemr6LAxs0xJZsjLIJF
                cQL6Swr1V3jKwcjNu3/vpK1TX1I6GlZwItco/61LN7Guthz9YNXL5vXbmA8qRQBLlYkH6RI7EpRH
                NVBXTSVYF5Bz001OTjyeMHaHxwG0vqyQ3NGkoRHBvj+RfO7FuFs/tXEuMkYdmQdKrYFzi2fx0KUy
                0wpDYJIwYVwMG0OdpSBNSWRKw+aRJdDU10NG6OYCdr1CSGYWp5BqYPzEVNbgTCfKxg1qUljJsZoq
                6+aSmQv2prly+DBwlsR4EURads3EUG8WrKqOxrhhFe7vARiBAoVISXlCw8pGXhQsmVpEC0eR9uQU
                Zm7NZCH4OW6MpXg7mSEbFL7Sed+TX7XbAURyfBgY22SoshXEMJl48c4R5F/ThU/Pb5c+wbOwZLMz
                JQ2bolRpNWYUBhd0IXJiajhFxAObmuLFLu8eqkyJNySYz9+UGq39q79+8Rn5YDVWIVbWosLbqGR6
                8OOHf0AF48e4xR/eKRFeoLXwdbGJD619Wg6EhTCt42LTBn6gA8vHsNb1+/wKWDOzEl3RMz8lxwas
                0o/PSOoiKW3r/GwrHJmFEZhPs3LmDXmikYWuyIKxcO4i1FSYtnj0Xv1gbQkeXBmEJQ07btkBYWiF
                ElWZhfm4/Vw4oxpiAcUU5d6Dh1NFMXwoAiperqAR9K8Nfs7t07GFyYB18DLQQIeYiWk0EoMYyvrD
                gCiUndZKTgQR00WEUT0YbGqA4OwdSa/tixbCnVT9MDfGzt4DgPP3SSEqKPUB2xTj7fBxbW4Czs8u
                7WlUSQBEKVxOBOlBdrZIzpERm4f+oiN0/lI22xIeWVoxu4CcXsu+Mjh2Fgs2boTzqnQlYeqUIV5H
                Yzx4kd3z6z7Pds2qIVMO7YmSIfTWIOFU5MRrmZ4dyxnbh9/QLivXvBuYcZPKw8YGzQFop8Sbj1Uc
                XGBaV4/+4VLh/dhBERvTDQpQOmxPbF4jJHLKt1x96JqdgzMxNb56VhZoMPppV5YkhsHwyLM8XEfC
                vcvHiQu/67N28wfcwQdCS342ppgbrCQkwfVIlFQ0oxvzoF28b2w+S8YIT2NIJtKw1YdTBBK319xE
                TH46cfNCf26tlzFB35w4NcUDABJVJI7kieOrUqH0EKQsQZNsfwqASsGjqSm/bKjOvIP//EgYJNhp
                ozZiwJZEX0Ie1p3bItXrOhjg9t+iX7IljYANnoikHcYxs+KuIIVRZDgCr5P4ECnCQ1EKtvhgnRmb
                hxtGleyucXYO+nhASjn6IShdMK6CdQQZZhK4yITcOtC99/e/xzqxk+BlrNDaGiStEH6YZWmgpIDb
                TBgtFZGF7ihRCHdghxdIWfQwBaGrWHqqwUatN7UwU13U44v2cpxkezh9M7YU6mDXZNCMeG0cE4tr
                AKx1fUYfeKciydEIV5AwJQHdgBQ6I7Yc2QIDy7c/ZTeV+9fIGKgnSMHTQAA/KyEOdmi8GpodgzfR
                BOzW/A/KIQ1ASZox/lK83PCe4WfdGqeVv0Kx/4oRR/3Y7v2otgciXBFKFG8AkssmIIU+ZjpKcLjk
                +a8skDfMwzW69mSlkRDm9vWvaVjZqHkPvsKiaGlnw51FfV/e7g6BfB8v7dexS4xZIL0iRRKkviVg
                x9yRVZCQSwlCaaE6hzy0dEtTTAuAhfHF86j/sfy8CWinpkquiT61FCDl8BSQSW0t7WuHbiJPf7j7
                D0onKo6utAicSlurwCgUWRwGLLgWVmQzRKEpwQ7e6KCHc/KPN56NtODVOKrPCewHL1wHxsHeWHVX
                X+GJNqjQFxXTCu3AJ71jQ9nPUxHdkwHMuGxlBYaoUZpS5YPSoCD26cxMvGJ1gxZzjmTR6MwaR9gj
                wc0MFIG2bN9TAoJRJvXr3EozMHsKAoABNTHTApzw9VCd6I8/dAt45mSE4r/lCKv27XzlxClrkHPM
                SFiJBiiwGQhlFWwpGpE39V11e3bsNod29uWMNTioe8Pn1w7fBB7lHh/s6OsCawdZIVINozAO9+Zz
                bdF8HCbmL5GXSHlTiPxJEMXInmg9s0R5GnG+YVl2BBTiEGunsiiUJVHxKPsS2MMCEkAvsqhmBINx
                vEUKicRNQWIcFHhIoWhkXFU7j217XKR/MMDYeQjZiqa0CPUjMVCuutumBybSJWTcnHyJJwxLrbEM
                NYQ1tODL7meqRRXuLajimYW2iGh9dPc73uwa0LmDMiBuPqvTFtZBjWzK7Cxjl1WDImH6vGZ1Jlvs
                CFfauxgsTug5tncf/2FcwdW47BZYmID3WCde92MNCUh7G2KizbGCPb2xmvXjzHw9P7sLDQF5NSbC
                mq8kJxmD38bfrArHNvuLmHfSjFXzcGiLP7DiNY1YQ0ixq3coQXdegxcdFYPWIECe0KFLv7IF7XBG
                kiLZQq6yOTJEESBQWjAgKxpF8x4lsao7e4OBw0dGDfqjNmT1/IPa/0JfsPsDBWWTh+Gix4CrAhN2
                QvJcHNaGNLiLMn9bmH1imx92zm241z5xCqa4hYZR1UabREiUgHmbJ8hEpIwJH+n9itJy4ePf4rpP
                9Vs3R1g4BCVw2KvvSpkHpsHZd2zVCd5oczB9fh6cN7qEuPQHddEbroiaMuxRqX147EweHhmJHSA2
                tGZuH547tcnh7eu4q5U/IwZ3IBpo3Ix8JxlQSUyqaZc/Q7G9U9vH0Zlk4mTTKpEv2zA5Ab74HYIE
                cYaclDV1UePdu3hk/fHoi06o4Xjc9w58QujEuwQ66tEZKtWsC/ZwvKnzFM23dGRwr3t+1pejT3R9
                jdazeQaekKR0khtyZNMEkFXxU1BOgZwVFZDX6KOkhWMEShwAD9ZLSRLaGKZGk1ZGi1RFEHU8QYNU
                MfckO2coroKdJARWYJ6dUvP1j3H2BhS3GVRqfASV4e7kThmabd8eRuU8V+yVgPvXX+AtJ0TFAp0k
                OJuIDcjwwCJMVhTf+vCI/C4x+8qZO5kyvkNdWgpqkNLVUt6CqqoFer5iiI8aSIqOmG5oPbN2DfVh
                V27XlYMTwKe0dEYGWeDSbH98LkbA/sWDyei5xePn+KRbNrsWn9TGroJ1g6exTHQuwc965cxIldmz
                F3VAUB0QM5ERaozPDGrNFlGFCUQlGOArRFcmhOwPXu0wVDsyKxbcEELGvIQ5lXV4R10YB7WzXYt9
                Gj/DVDC20dGJJ+Gzl5/g8DyxMKgfvHJsOGL0IINXi0QAlekrIUkAhhJylHbaiCQAJHpnILlOt1RF
                2rXpho6YUDo6fhFUVEj27eRKWNDVxINtjL6yDXP5b02C9Lg3xu/wEWdq8mwsoR9hSOhmprcxsTsI
                LdvHQZa+bO5dZ03Th5Eg7OmYvnN5ruqfzElHV4DMoE2qiWVkSGhBT8JSXh19wEx/fs/e5pfF8zMz
                sHbpKTCoFFW1Oferc2LDp1Rl50AFbOGIFnD5pm2t24ch5Z/q0wqcQOO0aGYG2VO4aFdUZteG/MGp
                iO+7ea7qncvX0Z+3cu494vmjsMl88cxNnDu7B04iDU50aiX4wDCiL6oo5AdmDbEty8eh758cHQ4k
                vDQMhHoK05bly9TOB7gq3zx6E23gWRFq1g21wF3bUV0ElbDe30dKBNor9585YYMGzSDwMLWxnq1L
                4DiGrbERGkD6Mkyf1LyZOO4cFGWhb+zYyR0tMcI6PicGbLNjy/ex+vHj7CTx/Yg3mJMUGBxEw8OP
                PUEdndjjrNl0ea/wMsLP52aNEWzmxloeYtPhVqfN1gOBC1easoI05ZESXaeliVmoVG0iJsrZVdtQ
                NQIq+JSkkF5EjJEZrlkGXvjsf3H3D//5HWx8kJCrrqUNTQJFdEYFE3gI2pOdJCAzG4IAmn92/ljm
                Ost3BIGKpjW2HVEC+sHuSLASEdUERR0NT+iaRZmiY0vSWXs2nZWFy6cBgTxxVixrB8DMkLR3mKF7
                LDLFGZYItRRV6YOzwFh7bMx9E9G1EU5wv3nh0ISMG4fe0qV0+P7twggA1ERoA1+rbWRksVAZqTnj
                JSVYEeuQZdNQ2YmLT9oWBh9pQav9wrEMHEInHSCoiRlIcPAaWYGOPU3j24c+0a9/A9Awazn9+/w3
                2KjM7s2oFNc2cjoU0bOInJwFNaA36GnXFo0y469j87+K/Awh4T2L52I3opacJNXoTQZs0/Fao8KR
                Nm5BN9SEClKYqQLxChTt8Yp2bP5cCycUAFSuh/lcQsOaR34jUNMTS1gLtb+qPNkiIdoY4qiVwNqB
                JYtDWM0LNjT3hZ2yLB1xV7NqxsarybF7FvfiEaMrtjXr0b5tZ5oiSoPVKdW6N/kjv2rF9I0csLLs
                0emoXp43IwuCoMxdH2KIt2wLDiINTneWB4vjMmlXthzpBEzByei5EVCZg9ogKXzhwngPxyE27t7P
                HICXOHj40Z2hhoQk1BAB11dehr6ZC71IQmuUx9g1YorBz2Q8HCxrkOrd+CGJ02CJNSRDC5n0AlJV
                w9cvhT+PyeorSnV6/g9onjODh7Jia4OCK/fSt4airDlY51FyMWktGggMUEDUlFxJL/yS6/Agvbai
                XRLQCmFMk4y8kgxFD/U6GmDhgCZzV9+JKYTFZTRDaFaANatsOJOfMps++woiQXZUrqqOYpIpGYJa
                9zTxzauI0D4I82c1cX8KmQSjo6UKNwUEPDACbUCO0MmsOsdQuMIeDeu34ZO2bVYdOkDMyt98OCkc
                GYVOOFvMDOCOljgCiHjhiYE4r9GxbjyomDGE8R1MACL/RLskaGZxcMSycmqY/H2BJvDM20wJD0vh
                iW70XMFYZpw0px4/wxvHpyD28aH3J19OzBPdI1sbBo3xKWPXqgVatWUNJQh7KWNtS0dCmP+lBW1C
                ImNEZ0Sgm5vB8HFmZsNcx8Mxd4SyjCmycHL2URzh3ej3vXrnBPfm4aMQwTqZMN7tQRZWqqyCddma
                4sj3IXW2yZNw/hyrrwlVKBl1AP2fZ+ePrgP2/0/goszGWEmVmjJ4XL7kIpBFPvfXrvHlcZdy9exe
                jUHKSb9UBGt3YoNeuORdm5eEDi9qd3bzEvPhL9FVTQnydCJE+GKNCeK8DfYb2cHSEgHaBuYEDMog
                MNdV3oqJImkFeCEVWAbUcT1CSHYPnIYhK3Kbh4aBUunVhPUV4OymLsEWrRBnGuvTCY9MiksmQMTw
                tCbawj0rzbozrBEiOS3TE5JxBDku3RL7gj+kd2wuDk3iiPNkd+mA1WzRqJp3evYs/UQhyaXYHnj+
                5hYJIf+hoxbaIFc7M+aNu5G5QNmkGgqQs5YhVldT1oqBlCU8MYYfEFPxwsrxpfoMo5DL6kO/yEFM
                lKicFNVxmxXVshTEcD4bJCpPPlUSqnhP4CefQjvVVsoI1dE5uWoq/oYwc/WXV4C3QR08USj0nb/N
                Z+BZYHd+7Cy7g9LKSl4CMvgQBlPvq7++LF46ZJzo+v38SRDeuxY/kiHFy9HE9v3+a+Z+vYVnVsj3
                o5BTQoKCOKITbQj1tM+O8wKzc3KGhrQIF6iDrpFm11TWgpq8CQPrfUUEZzBRk4ttfHlMoUXNq/hs
                sjmwm3Y8VEYodIanQ/NGTHYUxJKgYk+CPHrTfiLUxQ5NcZKxsSMbcgAgODrNHPszMyHAyR5aSH/h
                Fdke3VjoBmhJp4R6wZno6d5LY2D0vB6EQHOBsL0UoojjakpXp07w5jCpOVDEwg0mlG7tKAxLgh1O
                lVVd0IoXH5Pxwsb56/xNDgVPiJtBFAYHAQF0NfCTFYSYnDl/RLilAdOTIqyJcQoYSiphySEhnGut
                g+tWlHlCnRSfAndvGmICW4RRc8vH33w5l/sV+D5fYdeOq1gKW4OPzkpBCkJIQ79dhRMWloJBH1+f
                0g9srm2z4nwEz1cEMGXxajhCqokJJFpKYGhZHZn1bE/tFm5ewKNR1tKKkocXNIdNWVYailgmYa8j
                BUkIV917aYUNuPBNxaihbYYoakxRYOxfS6BNIeKZhakYtxhckoDXdBupsZ8jx6IdetI+ZWBWHNsH
                jMLAjG6Hg3lHh0REIvNSSZq6AqoB0d1xJRfbVQFd4Lc8tDsaYhHSdXTcbuOSMQa90GbalzNVcTwt
                iQWE5PjyI2HYiIUZTITWpqN4OykgYUVfUILHk/HCxs4tPyIRMQpmsCX1k5+PDZ+r1icBSQcJWVR4
                AsBSYK2shVa44sHSOkdmyN6jB/rJnetErUkvIqOIpU4cpTgY+WCa6dvfCprT/aJ7CwH25dugI3FV
                3YU9gVQHG6NyUzcVl0phTbqTumpKTi8a1bXIj5/OpV7M/JwQwLC5QoiFAhw8MYgSqKxEXIbNMVK8
                bMwN+1AnQPc2vy/VrQ01KHnpoImgo8tNZXgn2PFkgKtMLOdU3jGD//9B5rR+VhSX0iFg+Kx+zaWE
                wtjUNdrDcSrDogunczDIx3xeLh+Zg5IBpji6yxYUIclg1NwqpRBZhfHoKxCRYYGtoFc/NcsKomGB
                MybFAR2AkjEpxwdOkvy3Gd3r6MQnd3ckPKUJWTgIaiHDSJ6TTVdaCv2xyG+s0JLCrQNTRBROKPd0
                PM3r5+jYRuPeFJHddPjoc+xC4WAllEdDFFlX8kFhbVYvPg8Vg3agwuHP1lZj8rw5ElS+BFeXSQVo
                K3WjOMSC3Es988OvwJLPdv3kaWgyfsZRThTg0eQELVXkwaFuT/egpFMJWSgQUhlm0A5aAkQrSGBj
                IVlJArJYXBCvIYLMPHUCkRqhV0Ud7b+dOdzr/DLCwcoCxShKKMBJprCOBu0RaJQZaoyvLHvDEFWD
                ahCBMrwjG/NhG7plVgFTEAA8vU0jBkOHeDXxtdhLbVRr5Nexzb1BQ5MTe1Zkoc5o8OxtZFVdSYP+
                P05jmYkGiPBq/OmBVng03VwVhb449aEsmeLYSoCrHBoWVNk6M/pvnTRsC6sxaM1aSgJRCDppAHdZ
                EQQtKBfOpQ7ajT5ZcPwb/o2B9tbAeUNEt7uPFk4cvnow+5oSExEdxSsJ/nkaXfGvsu0twCTtThHW
                XVENyxN24QeXxun8By68o1xJnSwTIKcBSXgitdzF7AQ3TPTqgJ90dUl45wUtNAdGdTDPYPxVS/cI
                zo0IubqD1EQFqFMjiYL0KurAIq7Fy42/h/lznZeMBQXRstVBXg0bcDGkoiMb4uHjU5bqhMs8PALN
                IUs2o5ZjkydwBGp3ugPNQc6c5dSJPpIK5TBwxl68u6WWNCQhDunDrMgWX++DiMGxbJAYVV3pa54z
                Ak2AGjPW0wmSX/XpgY1QMNoZ0R2kUdXZVlEW7XBVOGVGLLkpmcu2P/O7JjDfpF2iLSrg1C7DrCy6
                orendqC2tzS6RlFWPCzFVfbLC/amzaQblfDNz5CvBiC0BS6D4hN5NbweJze934jFznVKybOR5LZ0
                778C1QEhEOe3JFvcizRJta4s7V6x9+abJPYLl27gJ8m7WBM4HFVkwS1hQ65zia4w1diMXxW8ePR7
                Rxa5zeu5/7zMZWHpw6g4kde6BGRg5DiPoGygqQI6+IWaRX/s4Vny1626Nvt+6I9LSn8DcMy8YVYO
                XYDAp/PTG6wJmioHhsnVWKLfOHYEy2P5Js2yPJrgMKPftidFwYpsfHYWF8DGaF+WJaYggu72Mh/j
                vMm5yLmVOLPjXkjoXTMCE+EDPC/bA6MQIrUv0wJcEKY+MplI6xQYZ7T2QGOCDB3wW58aEYO6gaK6
                aOxobJAykKy8Oy4Tm4eGQH7t++gUlDCLTDR2H+ojXcKgt/B1jYfb0J+TXwUdKGF08Ac2lJuFLEk+
                vvh7qkNIxOzsHo8EQUmVshQE8DrobaKIoK//BvIC84EFbU8S2khXDTb4kx5bXcs9cfjQPL86eNmF
                RVz+1+zra+ZSsoxlqZcStBs0JdO3QQI3wCEKOsjXHhcTi+YAnePHrMDfjcOXoM5fLyGCQSoU6OwK
                KigrklpQSWH7OO2ZestLwaCTGhGF2XhzlDs7B1ch6OzMjDmtpATM22xZxKP0yvDsfgbD+kelnCsp
                kahb8eWFiejlUVmVhdlIxFqaGYHOWBmTnRuHxwJ94TWKaNrMSk4ZWfGvLoyvnc8RvLMrBrQC621W
                dgVW0c1gxOxalVs/D65XNKL/DyxXNufsuyBTMxqjQbg5NCMSo7ErMHZGPHgkm4e/Ui1+sbG59j+d
                pf75P4I42NaU2rGwUvaicfakdbCXHY8iRgS/rFheREsLw6ouXUEE1hdJiIDy95OUQSy17a07SRV6
                6/L6yUFNCXdE5PkhZJnt64fvkXV8SB5f6NOygLjoe1UJnbAcNCyEe/mCDuBNfPnEaZrx8iVLQRKi
                lEhEAZqSZtsLx+ELfL6JunTzHZzBQlMjKoU1BEkY4eZpOy/vhA9t9hzwnET+naO9bNwepJxbh38R
                Aen96CHYOCMCvTCjML3TE8xxslsW7wNu+GngaaGJ2bhLVDyvDg0lmcWr0Qy4rjsbQ8GSuH9MOFw7
                u5/M4ZP4YYoP4TWE6umYu1tWnYOiQXd0/ux9vnTylEfYq3L57hp7dN00vPHTyIy2ebVrFimoFNW9
                y2aA7KwrywY+VibisYxlrM2DGv/0b3zM7Plirx1tCDL4HFXVoCjlIUEdGrC7UPm5MbIMlHiLQ0ws
                hzMBHMNgJN7m2OuSNGwt5AH+YkzHsKpdBJThIJbs7c1sYfjQPLAwJLOYHFhoGFtIqNigKGluZwF5
                85uB5OBoYkmuQRSClIpMRdIN/JHtdOHMM76lWrg/xRwOOhQiiPYlLUywYN/1vB8tFYz37+5C4XHj
                +/fQ7bh4RhUbErpuW6oyHZDVm+1jDV0+Tmmly/cA6ND+5xeuTd65dovHcLzx/cxfNHDz7dZX76+D
                EeP2wakX1y5wr2LajDnXMHcX77IlzYuwp3L53E3cuncO/6eTx73LQo0dMHD9BIwGXvP9rbVy+xdt
                ZUzB0+GE8eNA1uMddz7NgJXCRt+HcaG94I0DeGL7khTzlpWLHVvRVF8NPRRoi+EcIphenpIozcU4
                i+FgIIII6kRZ2ok/cQyMFMKI2eIgl0V5BBsrvr18FiK1LhdtWwVVXEiIpCrgJuXrmMUEKeHdGYO0
                UgLooUJWkoY2pdf7yiXvO2sRFznBxRTC6oUqSMAt0WWDF0HEeJ/4S9fdmIp3ev4NTWWVhMkcpc0i
                0TstxQH+eCJKdeaEks6dS9858G7/NHdwgwFwhcP+Ha6d1YMDwdhzYtwKPbV/H43g1uOsPv2bnDB1
                AR7IPFo0fh2vnz2LZxM6KiEjFjwcoPR/w9xsAS2rw9fCjYcJKRgp+eDgnZGTi9bx/OHjjIMeHZAw
                co7ceZA+y7/TixZw9O0u/JVlbcTrZmbK9sFQFSCSzXL176cOaPbug6uaGgOGIWAguPDyuhHIojfp
                nRNaGyGnHmfZDQuwcizLog2dECZw42PWH3inrjYGKTShJFg0hY5WkbY/7AMf8IWNgUxhPbl2Pl+H
                xMrQnBSBK3YwvdMCLTHVkkPr27mcBIKAPnPqbcQ+9/1t68fEy0fgk71kzAzjXT/xAgH+3t61fYsW
                Q+RsRHYVBkFHK9Se95BKCKBOPNOz/+LvznxsASYdwJPuQF7KSkkd2nF7fl3rfYsOQUWJD27M2XJH
                ckQKa7B4XPv2GW+9dvozQgBtakR5jAtZCUQlCnLtykJcYu965excndO3F81zYc3b0V54/s53zxv3
                76GVe27UQdTwWDxUjkyqqjWK8NFgye9I+A5ciOzVg0uhqTByZjSKk/anOcUZlsjcLgPgjoboReek
                rQkBGHt7P1705E/pK9f/0COxaXY3BeD2xdOQpvXjfdumBzc14Tm37cEIrVz6sPy4WwxQBYvRzcsB
                LTi7KwrF8/zM0sQJlHCOpSirB13V9/uO6PjANLMwKLjBJc+ELEtGuPU3v34cn9h3hM6QFpmnu371
                CEdofe36XX23jwIRW4e8JOxB6LlUJfoSyy3Txx+7OxFg4s967fQrFfFCz55GKk+bAUl4KFrAICW3
                VGI0U9bI+fz30yqzC2n+HlXbsxUK8lhvNUMURMgDpJJVS36IrlQ2f8I2DZvGIZ6nMSUZsZjKpkd5
                RG2SLToyuierdAtmMvjgU7qqsjJz6Sq8TfM1Y+5qq4VxKvBxYMxNg8O4wocMStyycJHG84gNy/eB
                Er+w8g8buWm/TF1vZdOHEMid4X2DdrNpbXVlHEVImN1VXYWVWL3VXDsKl6DFYMmY4ta/4ZsEQbdE
                KAFGlLGSF1fB6ctI0Q1KUP/Dr3hX3zzuhF7N9T2xAWhkYw01BDXzV1mCurwk5ZndvWxp7PI0kiRL
                azO27+1g3du3YLBT4RMGfURWCxIrD0kZRDLwJApH57jPAOIf99l6ssli7v2YGxXi4o0jNCKU+RwK
                KAgeLSGMLXwECTHlhcPf4fAcvGZSuQ5u2JQn83FHvZIs/WFEODXDE7JRrT4yKxbVA9BkZEoSY+nh
                vFZBX5S3rPuSbuORrGFs+f4+CiZdwDcmv6F2BubijqQy2xcEAK1k6owbb5UwkMs7C9ajDW51djV8
                1w7Bw+FvP712Jp7UDs7D8Qy+PSsS4zFwf71+Fc/QgcKx2MzZk1WJZdj/nVE3Bwe9NOrH+nsbIl6H
                ZEuJQKsYs8nGTlYSotQE9FErNmNsgLT0BZUgaSfPxhbWKCvvo66EShchtxCSIIedhKycBeSgqOFD
                rnElhuXPhl2XkOLHev3US+Vzj60MntyA3ZSEijr6Qs+orJwltKFX7SbH9APoJUKD5XF1FEJI1Inj
                Ty5BRQK1DBSBkFjCba6y8uQpluO6wZOPUfAcuJA8dQl5yFmTlF2FU7CDuLS7E7txC7sguwKCwGq9
                JycGrMZGyubcCG2sGYkZ2H2aWFWDKoEuOL0jEqNwWrhg7CluGjsaJfFfb0H4y1qVlosOiDYbbmaH
                A0x5zkCCwtzcPDq1fw7OI1bM+qwtqofKyJLcCqpCKszq/EofqRWB+RhnW+0TiaVoxLZYNwJq8WO2
                KKMds/A8NDczGz/yScPPjta6F8rzGwpBJYIiVV4M8TwYEvB2slNZSHRuEhuZ6Pxlzm2plTMTAzDd
                aG+ugpkCfNSmxEr2xZeEeBEAWunrh18Tea5e7Vm8j1COXAwraQs5fhwVqGD2sxGYTLqiFeTh1hJJ
                aCKAwLoxRHsXs2hcpVFEYPogiIscpACRkMJM3TT781VtRP+EfAwuzE1j2YEJqBdVF5uFs1Bs8HTM
                CRyBwssvPHjugcHMiuwrny4bhUMgwbgpKxLDACu/OysYs0xerUWCyMCMUczwCs8YvDaqcwTG5ngS
                E6rbHO0RMrXDwwn3rXPgLfuZqhOF44ENsjCrDANgJzbEKxJ7Yf9qSU4FhGBTa4hGOdtT/uEUjuFz
                bgWnod9kWWYpJPGoXxFTi0q2lp1L/bPoIlXEKEQDkRvFSofUKDuR32v2SMVZcPHwobdS30JJJwZR
                OnZOXgIq/wFbAQs+R6haH3B7DYEQ2xHUutxcQJJPKIJ1cTJS2DaGkxxBNYUsQILGISKCKQVErxMV
                gowFAFRVTQf/Mpxmeu6nON83falSPnMCOhEjOck3AoqgKP+43DxdT+WO5CjOARgb3U+89k1WCfdz
                p2u8bjUHAyjiQmY1d8ODZF+WKxhx2m9DDFGgcvrO7jieVdnDDLxBSHfcJwMDgEK50csCM0AiczCn
                E2swpHooqx1iEGq20icDa+HHfzB+NCXD9ssvDDEfc43Euqxv3MQTgVVYZ1fnmYRZ+nD52JQ4fPfc
                jx32sMLGnGXaljC+BG7F9q1xeND5t2Srt54QJGF+RiYGocpvYvpqClacEfBphZBaVwV9GGnbgk3K
                Sl4UbtmUed5caF32iWBzfvoiw4AZZCVW6XCmtxMaIvKdgRKIKl5BBFaAuVkUCYDLGKpBjSKeVKSC
                KfwNKPGKdKTgY1Igq3ZfkIFypg3ZwFlOkfO6P/a8a2u7158ByWJNVhvk82rizZjH8Tq7179hxXhk
                7AmQFDcSKvBifDi7DNKgJHgzJwIasIB1JisTXeG2vD7DHPoTu2+nvhWEQK9vrHYlKHrlhmZ4nLxQ
                k4kRWCtQHO2BQUhKMJOTgWmY89Hkk45pOBu8lVuJtahUOe8djW1w9Xg/NwI6oUF2IrsNkvF3ODC3
                B260FuQO6PHjr/Ecaus3HZevjrm3BLx9oJJDCvIJkLRm6cOYUBVAY/TW34KykhRE0JGb27Y/PCj9
                M5fkJ2XztyQdLwlhXAXUEZucQsbL+kj8aBhQ33F/nHoBcxiwNfABeeDJz4EvRHtuE1H2Fs82tilA
                ACUQxjFRkpVCqrYFy7TlhmY4OxbYyRKyOJCmVFxJOyHlPe/6tPtf0dxh6HuLzvFJYXjMQtemXG9Z
                i37/Dz6zc4WT0YR0OysYPAcsA7BeczinG+XzZOlkZja7Ij5np0wr4kf1zIz8VWYpFZDn0xw6kLTp
                cG4nL/MKwLtsRyV3vsDY7GIb8k7HeOwbWgXNyJLMQp7yTstA7EYedoXKTvTgXmY6c/uUF6PyurHt
                dP/5jnu7/F2PDAlLFT4ailBxvqxJ76Snh0+wZXF/tXrURCy9aIEKkiia+EFBKz8do6GJAc/+HfQJ
                1vKHzZSL1QEQ5EGsn2zv85KPfozn3UxmXDXlkbTnSQu1AOznIScOYRQPgyRGkS3MaQgZQYWHJI0w
                ylCx8bNwFvyRfePX4UJVrKqFBSQIa6NkZkFuCv7kDxZ431jGunLmHX0s24fPw0Lhw4hOsHD+PB0a
                PYm1+K/T4J2GcfgT2uMTgWk4YzBWk4XR6F7en2WBLUBefGVuDtvbs4U56FeYEkbi01cKTcEbeHhW
                FbhAVW2PfGdlcv7LD1xbZenjjrHIXTzpHYZxtEYPHHUddY7HWKxWanBCx0T8Gs5Gqc2XPsH9NuzF
                gHbagbCmsNbfQmCWGtwuMGLpkdXLUK6cbtSFKoIUtSCYUyysjQ0Ef/uGjud2aVrr7cei5elJzkFZ
                Ht5Ysbv72RyCr6wPotCG/ThdMsLuSCPISSFKeLUSQkyQElQEIcIZLiiCV2yaDwqq5Fa2yvrsHDY0
                dxbuVS9NNVRSlfllArQrVfJHeX9Z825voanzTi5vlLmJBdiAkxCdiSX4xdcWnY7xGOrb1dsdrMEd
                t8ArA/ORR7s7ywLt4cC4M64MzMgeTSfsatcQVYnmSOIY6K2JbTDWcrnXAwzhob7c2w3swcG7tYYU
                N7S+wydcSO7g7Ya+GJrb3csdHMCyt6+WK2eRCmeKVhdsUY3L/9Y5/E/CNjD7VnJ2bBVlUbVhJSMC
                c3tHcl2/ruPTc0sHXMJAzoaI5K7TYoUTZEWbtuWDV2FMc8N46fRGKbbvDjy1PILYfoVm2wiwD2ea
                fnwMLs3rXryDK340ZwXcjlBBFgAgkcgZKS8CaweEuLI4B0SwSBJo1Olq+mh8r2XTHc0gqDunZAnl
                AWtdJCZEuKkNfH9W+d/PRHxpbBmplahJHWnlhi74sdzgQOO09s7G6OxZ27YaObA46lh+BEURDWxZ
                ljlncrHBmaite3zuHNrfPYXuWESYHq2JlvigvlzriQ7Iq9dubY0KYzNrToik0te2Jd+15Y3aYn9h
                BgNra3xsI2VljcxxczHaMwK7ECJ3ceocb751wxs7dv3iKBolp3eR24S8rCmtow2cIUZ/fv4Qjh7f
                MXuHPyDG4cPIorew/g+tFjePm4aXmwAf6h8FPSQahAlcAiQJ55X26H+s+nxn4Cy5M79zDALwLO5K
                9cCBwRUpIUAUmTsJWFG4lZewKOo5Q4/CgGT1FQR4FRG1R0641ZCSnYNmYMhrPdKGRUUSmpivR25m
                D7Av63jKn7a9v3Y451COa2tcW6jrbYYWqFdZ26YmmX9ljn0BtH4r1wriAEW+NsMc+nHY5X+eHW3E
                K8fXwVJyf4Y0KgCtYm0PdpNjjiQ0zSowe2tOiEjfodsb5FN6xoZ4plrbpjW1tLbO3ogBVmFEl5JW
                B5SiVOb9zDTaD+p41NkYjp6wIPaocgaTbAJkkhsSKKQ3xx5uABboT6t8aAcuX0afjot4C/ghaCZJ
                t29q/x9sXBjZvw5rNO/wksbM7sxunz4abdjJspx9b6iFOUh5ecAmxIx9goKsPHwBApJGpnZeVj/7
                xFuLhlO97ce4CfyeXsCY/BaGkV9BdTREqzDrhJKvqfiAC+Zj9Tr15BofSsPqGY3c4RS9qYYXGr9l
                jSuT0WmrbHCvNO2ObWBxs9zbDEoz1OVHrj2rQoXJgZihPT/DA+VAsTbFSwuG9zrOrUDhtad8O21r
                2wuVVPrGndA8va9cKiVvS5kzN220dhdXAmVuUPxOrhM4nym3TCP21stS7f1h3hQVLAX0YIJ5EATt
                rqcGlmhBwXVxxYu47bLOz1kyd48+wpGh88wNXTp+Bn3JzIgIdgEr8+PCFCdA0xLDkTTx/8ekOwT2
                Bhdv/2XdgbdYSZuAx85aQQSaLVTUcPwV3NMLJfBdbNmIOjq9bh9W8eSf0X+bUjuQUYJiWPgRKkon
                UM0JCT+7c9CvItxoB6ZddZHJ23GdO8MzDT1BmLu/bFcjMLLOhiigUt22JV2zZY0b01Flq3xJ4cB5
                yfFIn94/2wdbgbVuSZY55TGyzq0habu1lhTw937Ovrg/0Ofthp54v15p6Y194eayzCsDmsH2Zn1W
                LpxIXYtf0g3v5NTzX8njGGuHP9Ghw11BGspgp3WVmML8zH3IZBKKYQOMakA+KM2qJf516YTJptZm
                gQik27wkdZGQ7kLcLYDi2kRd1k5eDdzASzR07k9rf83H4NFnJF1kSxpuJ8eMlKwFMgiYGhIdi/Yh
                Xn85ixRuBuuH1gDZbJF/fvY1wPM4yQFmGkQBnhPGn0Dw/ltuT9bxvL37l1B7Alr54YJBrL3cOxzj
                0Ma8ycsL5zX+ywtsZWL2vsTnHFmWGx2DU4CDsGh2FjgQ+2BLthl4Mn9pM7u+idjWtRJTifWIwL2V
                U4lFyGGXbhGEVgWZRajy3z12PblgMUkfxz0c/nxuq6IiqMYxNvWT7iDfQ/tdm9U2exY9xULC6twf
                i4ZJRb2iBCWZHErDT85IQIEogQRNo0mMeDo1AAt9btCQt/8JAZ26/Pp4c9esuIECxgGztKYvuQem
                5EloGEpSObNmFcQT5uXGh6COkFUdnwPhYoIl0zjlzWGEUlJFImssx7cbPI2DH/C3Zm80HsHDofi9
                PrMN0/HTMtArDaMgBnotJxu7SCQmYCQUU2tmWGYlVqMNbGheJ4UgbOhmfjoGsKrsXW4UnpRFzqNx
                JHKkZjZ/1EzCsainGZddg665ctaP5b9uJZIzLtHODOE8CfPEMAuSI22Z61GevYn+fvxaNHmJWRhj
                yzHvBVIo0qJQUnFsQQyKwJLL6mvQgLf/D4auPTRuSEpaK3nDL5PHHEK/GR2a0LCmwdkGdpCx9dI3
                gZGeHC8Q9bwJHfm5Keigx5FdQpqCKPLlilyEe6SBZhOlpoKK7A86+s9fHfsPMHLmLVqMWo8kpCgr
                4pRpm64nRmOV5u28O50tvlVdgaFonNcQk4lFuEszlVOBJTiG2+6TgUU45LJeNwvHIiNpSPwZqRs7
                FiyjKsITf3v9AhGh8/QaBxO/jyFRCvqAU/Nj1BVgj3Nu1Qm5rB/f7bfP5E4nVGXCx8FOThSG3nKp
                CFlboaMoPD8ZR0zW/tV2BhJ3t49z56yqnQxSQQLy8LV/JjfSkqsmNr7quo49LJpoUEG8n1jE9OQY
                SePnIM9TGsRycMNGuFZE2iQNI7YUoqGBCbjsYnP37Jje81lm+W9q7fitjuVshs1x1TvQOxJSMbJ8
                r742J6Ida7BmJrZDK2J2VjorUbRvSyx9KgGGzPKMHO4npsqxqHjYNnYO3EpVg+bSXWLN3xH43wTx
                vTFiPKB8BWXgO+8mpwIxlhJyaDbhSo9BAoobeKLiIsHTF5QD0e3/tl70mWb7YIYYKJCeykJGBB8q
                Gvtjaq8/t9sZP/CizMGp88RR91Q7jI8OAlIQ5XCT5spQVET4pciPWxYu5dvoKJUbE4PHdu01pzlN
                ju8WM9rZGjqIBoGXkUkhBkM7T+l+zGxSvcjLHLBw9jZFAoKvqYY6KbO9YFhONEUCIOe0Zji2805j
                h6o7xNJ5R16oJZQYHYmJuHNQUVWF7SgDWDpmI1McuyMfOwbPpK7Nqy/78KmCcPHyPPJxw2sqrwVd
                SAt5omYjt2QpG7F8ZmFeDBrdvc4BrTMJ/nkz37tWbIIPiqqqIXMYsZiVublm1QW1GLF1/Qm/8BFr
                ZElHcPK/SS4sFZVgBzMSkSvDwkmlsQkH6hJjaWwWbQfRRRLBONW7dgnFlPlPKVkCWpgqQWPbBo5A
                xuP6EfbY9PXcK1bYdxbfsxXFx/EGeX78KpRVtxfN56HJqzGvvmUlqwAvsWLefS7nlLcXTpWmwaMg
                5bR03EtkFDsCwllQPCLE8PrHbyxFFbf5yy9sdOinjWuHhjkZcPFgYFYHl0GNalJ2NdfiFWlgzA6q
                rhWFczCuvrx2PN8CmYP3gc9qxcj8MbtuP4pl04uWEnTq3bjrOrt+Lsqo04vXQ1TtH1ry1YiWtL1+
                P85h8LLvbocYhJdzhJK1PYa4SZxfncvFumWdjg6MdrNZJWObB6HTZMm4n5gxowNCEB4fr6sCXNYi
                Ymjj6Kqgi0dsStG1/eJeQ/wMLC3aywJHSWEsCKL0+gkYOvcVuOVZhY+q0xVjmxejU2jxmLiRY2KF
                PWQillOkdCldS2Nsr8EvDgBwx7M5F2aft+XFmzGbeoIXYXD8ZOEpvHhyzA49PX8ObZC7x5+hyvnz
                TiFaWXLFGI/ymRO3xFIvA1pVfEnq8psWee2JjDK6rE5+cv4mZIKvb1cMLxwBi8pAp7Q37+DRuTYI
                k9I0UNwObfvqYO9Yal53RNSq/o/UtKr+j9a5Ya6XsuNR33+PQ5HE4pwJnwDOwPy8TilHLubvmPMD
                ams2jwGHgI9RAor41KJze8efnrPZwekuvZSYFJXV4BArr1gL9Ja/hr6cNLoAhf9tSGnAi9JWTQlW
                1p6B36HyHzR/sPsDBAnDtxGqZCDVjwFdFHWoiQth251ZiZvaRKu370CM7u3IHDq1Zh3ZBhqO1sik
                IdI5Q3a8ntCjLbwo5EryY8JRSR2M0Wty5937Zvnxtb3mNzWhl2BCbgEonSI6kleHzyAt48fIZ/E8
                v9VWOV+5Zc1AZbH1wq6/9paOBH2HsC6PncfriTlI9zUVlYEZmFO5T3HwGY21S36aa28JRRRYSSDr
                KpLc7v3fMrsLDBunt37uDaxYtYOm0aYs3MEKCjBw+SFwGy8vDgCdGTvEcPZT0UJxVyy7J/yf4DLM
                zYTUCv9j3Rg4BiQSdyVlHDhtmzcIIAMqe8BGV9eqFf+/Yo0DNArkgZpfLqKFHQwJCuPfH22nU8pb
                B6iL0jQuXU4K9ujKXjpxHY/toA3b/e/4Q9Cbk44heO58XVuNavhpt+8CVjgP/44NebO7fw+sZ1vL
                5N1ErfM2ZgvvpLxlzrEo8QnKYO8CWwsAnaj69e5Vjmt/b8/teXf31H1zxdWoZ7BWW4RiJ6S3QW9g
                ydyl3vrxhbYmPV5GnwI43pw1PmbgJ6UgSU2bMn9q5bh+O7duPKyVOfpAIzdkvg6pnT2DpnLuJ0De
                AryYerpCy6iPHg0qYnhleP5u4xfcm+CBYmhtJCItFSQgqWJHQdpCThJuTBT0GAED4PcfR9AV+AKp
                ECqvhC9Bcqo1JBDSM6dsOLS5fxktIUJ2du3oQPTwUxplY4d6xpE+3vNQaWXSmZOBYUhFdl5bhRXo
                2fP7tv8bm9e/sG+3ds5Br8ysgGHMhNx9GBldxtiRuHD+EWudTPK/CjscZjs+tODPoyWJ5cv4nV2X
                k4PGYM3pGL+txOLprHsd+XjIHlaFV/XCmtwLnMAmyPSMXBujHcozR/xS4REBLMzOEoLUIARUExhs
                1Q1Kc3qtxckNC9K1w0dRDRtTu2Ll+By2fO4PaVK3hCDMMCEbbRaYVpT/iQ+3EjUugkLocE11CcOE
                x18/OXWfWLYGE9c9P69WitIk9hszi8pZp2KA+REEMSCaESCWkMkuZjGIXVg6RlUEegYVvgD9Q0wN
                JeFljSvjMaFJSQxxNxmyQF6Blj7cw5f2mOC+eGstNxKNwPz6tKcK2q4qtgYTP2b9+8zjX4tfo6LH
                JywOaMJG5c4eXDhwSWM9yd6d8aA8ta1xhcGDT6i2BpvH4LG+JzsIrC69PVDfiJ9MhHe3rp4hf/w+
                wdHXd4wCCcqazBiaxC7ApNxKGKhq+C61uM1eXK6dM5QLhQPRdb22P/smW4cegg7p06gfN7dsPbuB
                W6UaDSkdqpj7o6wrt3Q42fL7eP5cmtW5HdsjV86Hcn0qc9RFqoyaz+3fk3XwQLM1Zxbr1NYc2TRI
                isNKLoNVpcDOkElmJK9WISmECgGSMji1qeHIqJzgawHeNlFVGvo4W16WmY6eyCXBJSPhTrx3c3x4
                ndez+c/c8bq9gtHFi80VhZhEtVZV8Fy0djbuH9rj1Y4eCCnTkZHLP8nrEyL3MKx5m64V9s+J9ITN
                7fuAvnGyZgr3MEzhQN4Fzh19zPR3tPYDnVfwgulg3AqbQ87A+Jw8Himr8ElkMMDD27obdQgDBdQ2
                wc37S5A2MN9iwTE9wptg7waW4Ct+YtYKWphT4CEWzlBPBUJMaXV+Ce2PChcNlSilxR+17YtnbnF4
                OYj/Z1sNCfcsOiKSLiI1QgQJS0FKIIJIkSEsiWlUV/usgYYpfRUrKokxBgoEADA2R1MLxNF6wfUM
                otzPv89ElMdHFBkLQcvEjXLB8/+bv9NKvYvWnpOBHijRcElgtVdI0/AAszVoFbSefszsv/JrDMcw
                vGwYENX2UJZj8TK12totC5jzcuFdfi36SBWP6+BhoGlstlg3G7oAqXE8iVBkdjf37Zd4OFzbWdOW
                UiOuiqwExFhAF+/nh45iwXmc4r7ocyHz+kWtqgPjkNW6bPwI558zFrYD1SLKxgzxOQrJCBMwElgE
                DjIsdHLzkhUoJjfxcozL4KFlbwRZPmwFVTH67i0giVlkUYsUeUUIQRNjZYFhSMSR07E6vIk25RRY
                26CWa6BuPypOlcRbP/s9ctI0cggVxUIE8BYc07YMOcxV+t1N8zVrGHUtJxJtgbzxlYKsu/GSxbvC
                OxM6v4m8Cy0D8WB4eO+l2wMPuJALPFjUBoH4wnJYNxZvCorzb+e9IsF4hV7uWV4EZcKk4HR2FPTt
                F3gYWVZ/n8xehLLqSjUA7uejrYvnAh933j06cwU9eAqZIKGlIzuPJw7fChvg9v3gJPNS3SOLLwJI
                DYkKew4knB3sgQtdUDvx8szNhF+kckwUlOBT4sCZQRadwSl0+c4H5/dO0a8khRVzbviN3Vw7jvmL
                H/3dqyDssjA1CsrYEEcldRUiK481QR0KEvNi7b+OHIbzdWsYcJLKcJLM8qinG+4tvBstYrBntSmS
                D+Y7DM8YnB7voxfwgWdi/pwqDhOGAXjC29PLAyLoWbQ/Mle/u8EUdqynGrqAA3EhNxOjQCO0gofw
                9Ytm3cDf9eTrCkunQVEyJesxkOLlnODW1UZKSgWytjFCckfgLJ4a3buKiJ2dmDBxFCUWxfSWk4kX
                SwlZGBlaIc0rzdMWkGCXQ6/vfsD8Eyd+hEBLXqAm8lbTjJiOCgoIKzhw5zv7MBrT0Da3F9xWru2I
                +2c8IUVPXogUItFeSJpJHFk0YCiTBfWRXYsZUQK+s/HPnt1gSWTA4sj8uLcab0j8HCxjGezFiE5Q
                7B2JVE0dA3gGWmazR29h/5h2DhGoPcT2PNKKyy9MKCmN8Hy+HactzuV4jbSUk4G0Jgyfg+sAwq7Y
                8+8tpwE5dHpLgI6WqG2L+waad+Np4yb/aUT21xmESsbbeuSIwIwxOKfs4fPozYzl1hRWCxk5ZGX5
                4M7Js1w/iGoU3l+awNv2S/CxZmzD/WkO9zV9GENzW4p4wQub3McfnDlncc1VHFsnRoxjTMTMtEvm
                EbFIjUUCEvRJW8NAqEUkggkexH4spGpAKnFh0xZ8zUD1f4NmOh8764DBz08cLzmipc6k/i8o/Awi
                qAGmRDSAq2xBVRNPQNmoWioZ0lQ/4QLMy48hNg9tQNxfCwhK+uo8fWsDlMTHgjuwAPEtJx1jMIBz
                MK/jRY5k+bA8tmJrCnegwhLRkuQUEHCdWds+dwv3P5+bB44uYl8+Haqxt6tDLE9atXuO+ObdmGcB
                19uBGj2LGd6dQVEerqh1nzft3Zv2Z/CBZmc8dPgLO2HrxlRQgldgmXU8So0HDcv9T0TAmbDLV0eD
                1y2rZGjoYOcnkq3P2halk+qoUEFpEUYmQlSH1LkWCWQ08eZbKrDXYs3/hNmWTGKvZAegH2Uuj3tL
                YK56urvgks9zdswUwHH6xJzPsmsCz0iMXOfoO+CJYXpAke3r714VOTsWv89PYdVo+e+MU5rszYOM
                vxqmrczuuHR6l5OOMVij1J2VwH+BZj19hG5XBq1xkupEfC5GSRKCeDJAGPIlUeMkxNsWjwIBxavQ
                LHN6/HpjnTUR4ZiAd37+DF8+f0/3+RZLiOMeGx8CeB68uXhpciH3ZG+hjeMA7vKB8/DCzsflFZdD
                ychcoIkRQilqKfdC097F+yiPudLUcxyNcZyaqqKJBXQ5oEH1mUcgj5uZLiSJUWR7CkGBwkxNCHvj
                OV4MFaqI0EC08c3X3omzLKwLKDKnuzvxfu1pbidHU/AsuXh6U/Gjvve6qsffUNlIZwd8Z/zxhYFv
                jGYntF3RfBwlj2a4Bg4zZfKwfHLNVluJKfjxuku04GR2J31rcxCzvn2YPHEGPlAidFTcQIVJApJY
                csciXJFKGGSUsS20vDV00VSV07IaFbFwS1aI58exsuv8wab97EksIS5Oi04NouWlaAIHUVbkWvZY
                u/XT9+E1iYLZ46G+4GreAjLkCKpAhZIiVMjgzHk2tEcVSxt8+eRrVBCxTKKNDvPMSKSVCo3fRQGn
                v1pWRDqZe4OHpTQa0k5WGvqI90ClXPHjn5h0qcVeyG3AKs9ffA/fpSXKj9Y7AwY5XNeja7Gfi1xv
                xoDCxLKYTcXUPh8De4oW+1t43PsL88H5fys3ElNRWHQsOwI7/4D8HC8nDtxCnUh8TAWaSKKJEGcq
                UVUS4hj37UaVMlZBAqIQ5v6pDuBBpvYhwfOXlKitzYy/YFC3FwzRpMJsHbr0Ub5AnUUCCpjCS+Cm
                JbtEV9agE2bTrw4Wp/bN8MlqePn6Kewk9feU2kEiBKRcooo0hnSUo8np47i6fHjmGwnjEKxeUILN
                IIo7DMnwATJMbe8xBIr0702YIAw26Js1FHO2kRrFS0UBQUgwvHTlNjfb2BWMVuzMjHtiA/PKnrh/
                NlWbi/fw+eXL6Exx/SoysX8fDyBe718ZXLeEhu8t6FC1x6fOkinl29TNf4egMxsKz0D8N+0hdfuz
                nJXMeL6zfx8OIlOv9lPKLrsp1RnlygPJy/iEeUHl68iPsXL+DuhXP0eg5Xtm7AlqQoXEhLxu30DB
                whgbsz94/BwjTQ6IhopOo3QyRfiHQZAom4ENWSCiihDpsmKYsQcUl4sUeL+ZKIIhcfy5NHrKwqt5
                NZkLYOgrQ0ESEUIltWHlWyaiiX0UCWcjOUO/hj84I1ePrs2+dJfzNYmN29cQuDIhOQyFdGuawCKu
                Xk0F9DGTOs+mCBnR0GKmqhgjRNgrgEuSsxeIpRQYiJQohFmHL3Eyf1TWBxZlviCYRwo8L1EBOHi1
                4L9AuKxcWTZz9R52+NVeyu9EIcCg7GnbwUnEyNxJGiTBwbWI2rm9bh3pmTXLp75jilE7hHTHfn1C
                ncPH6C0nHcP3USF2dNxpPTx/Hi7m00kvZgr+9f/3KDk4Fls3cgjhXkfwLLT/T76/v38Or2Hby6dR
                dPDh/H1QXLcffkKdw9dRr3Tp/C7WPH8eDESdw/Rtc9Rnmg97dOnMCNE0fp9SiurV+NYykJOB8RgU
                shkTgXnkhuqOSrYGH5eHLvHk7v3IECI0NkScmghPRiiZQsysT5qJASoZA6WhKBxY+tekBgCeVLIZ
                2OSSU3w1xNgJgMsQ0P3nwZRBHzFEjxUUMgqhAZoLqjLabm1ZMEaBoC+Vb7U2Bhtnf5aqRqt0AxgW
                UgTxb9pSRJzPLQj0KxOr4C+lOGU+i7MNIpzhISpFOoQBIiRFOKoPeeBBZ3os5AAR8esjKwoIJaCU
                Xw0DdBaVACLp+68EWGYRV7iGjzsLcvTpIrupAQhofrVuDF8SP41zeMtzB7d/sm7syehuPVJdhdmI
                Od5BYuLVpAYLiPtw8e4t31G9jt4oXjCQl4S2B68+ghzs+bhb1Z2Ticlotj+eU42X8wHu0//EkPva
                ewmEvPnuFncnc/03fslYGNRWIsvP73ixd41b8/zvsGYq+lE06FpWJrWvlXBe7zp08wMDYa8QY6qF
                CQxyAZHmokpKmueegvI8stbZJLzBxF33lKSlB0QwxOKY1+yyKgxBGrhBNYvAgsYfKyiJeSQJ4MH/
                0Eqig37IQxQenYumAz7t758potX7M/DZa7V69jbHwqClS1USsjhwYpaTTIymKoUIA6KkwVpVyeNK
                J5knAk0FhTr2CUGCkmS4Ug2iRX5MvAQqG0Kwvf2KK+IiEc+Yrw0jBGRXAyrjDA/EYzsIrdm0QN7O
                yGzZZ9cSMtAe9u3cL7l6/wjiUS4WyN+qb0Em9fNiX229sX9MoSfX66di1uVFfjTEEh9iWlYn1QCF
                a6+2BvQBguBMdgo7ktdnj54khqEtZHhWOBlxfWeQbgaEwajhdWYF/tIFzYtAmNxDYHxg7DoVGDcW
                xEPY7VEBjqBuJiXT1ODxiAR8RqD44cwZ3t27k78XcLy3DMPRA7bbyxPTANK1IomvsNWFiZ2VSOo7
                t3w09fD+HkroeK5DGVWLieGLg/6b060iXlVNdpBKBQChZ8KMJk6936SUtQ/Uohh1gnjfRMCHVK9h
                iyrwxpRilxpJMrylDXRbWVO2ZWjcaZk39+dYc/DRZmFw8dQb92piijELiBJ0QdMchoCpNHCgQYRA
                XLokLFEWDcCBB2xB7upGHCSbMkEIVGUYFCCCzBMqRbqDCW5K5sSNX7ySrBTUoe3mrNUR1IDMM0zG
                eAYVMKVmeVYXVgDBa6+mBPShaOldRiY1YFVuZUYUFeNabkl2FiSSmm9OuHmXkFWEwNtG/sVCxIzs
                fOoSOwtl8p1hVQyimhVIaNBdVYS+dcFpuNVdEZWBOSjBXB8VgWk4pZ0QmYFpuE5dn9sKugFjtyar
                AqvwbzqwZjRt0QTK2tx5yGIVg8dCgW19VhafUAzC0sxYaho7GgvAarG0Zg87iJWFwxAIsz+mFjZh
                nWhmdiW3IZjoydg70zVnDu5qOxsl44eQ65IQlw0DWCn7wSaUMeBpHrHktAGUdpDLF3LdVdMdVZKt
                Ufe2rUhT7bU/0HUCeNp86YwOqZGCeYwBJAQGF6JowAFSUvj5R2XTCjahD2bz+C6zf//BKr3wWWJ/
                ceYnJ6ETKV9ckPKmIE0d8YavDhlPmBBJISYpskSt6UWXtiD1cSuyzz0eRfY+j7SPZAExXSh3qDva
                w4bMin+pL/jeKrIoinCl8FLWT0scXRbb/MnGeuafuiLdhFlbxrylIsrhqH1UPnYvHABVgweBVmjl
                iHaVM3YMGK7ViydieWr9yCjRuaZozt23KYa4zTpy9gw+rt2EjHbFixA+uW78T6pTuwafE2bFqwCR
                vmrMOGeeuwasE6LF20DiuWbcK6VTuxY9V+bJ6/E6vn7cDq5buxchWltZTW7aJE31NaT+83rN/HPW
                R2+eodPGtsmln4/PkrrFl3AJtW7cOmRduxf33T+sGfG8vjsV0HkGDnjb5KOrCQFMBPSkgMIYdaYu
                Qx5FLGi0tjHGMaqstySqls7RxKLvTeWUKKwEIhsZgcsQsfSbJy3MoX7pQ8ibnZdjL+mnooCojExS
                9sOvWt9l1gYfaQxG6DayByFDQwgMDSQBkbRGm4QA75xCwpJHKDKKOuVCBX+t6HEluyI4JAFUGACS
                fg+BONslWmLLnfCf1sbwDyub5iPIq6FBHZqRPWL1rEFe63Bdy3/STev/sJF07fw6LZJzFn4Xlcu/
                XL/JKfqNcu3HHkw6e/bjfvNOL2vR/7DNTHcm1csgwORi3RmUBhy5dHIEWcoRQUpIkJUUUAGC4hh1
                EkUEcSWAZTfZVRSqG6DSFd6CNJrEy/h0spIkaMtCGxSzRpSG86xouOcedJwENJFWnWbhhVNwZTlm
                7BuRu/PA7yZ+y7wcIK+YBCyKKeVsiQIZ9KomucnBBDKfMlBIIsokzmK30o0wwsLHnR5wDSMmwlqW
                gCRChVjhOByoktFkR0GyVNSl5GgEii1CDSO15yPPi0MkZOXAI2bdz84cpN9rGif5s+2m8//1X70e
                djdnDzdlQkJMGrTWvYkZB1FSjAi8LjAAqPYyQUkEpgKSJmGUAMU8+TwwDqaIxV8sm1xDOwUH0GEa
                uEEqCixRQQS2CJIrBEElg86Rg3OsaKWDzRzBpjyobiwZ2mfQm+txzfDRZmbOuZ0TnlyDbpgCI5Rd
                IsSmiQkEGppAyBRZJbrJC5Hw9K7PFIZ8q8F1+C9IoM9QI+iV4eByJnSt7kk4Mo1A5nd6il6Xc+uS
                shgUVRBBsNTfj3ssDE2mHYvWnXD2+0f9JY3k+u24+1w6Yiy9oZzpoa8NZUga8yu+8mg0ByP3Eyyk
                gisKRQHWWTBiklVikjTVgkI07RjhiSqR4jKQVy9UtsTcfEEqjiCVxRxDLBBBY3kgS9qV69DFticH
                oZHt75648S/yWwsIuzJcbGJhcg16ANKqWUMVKoSmG0FDJJqyRRYcJZhikxsDgytBMtBpBwY2CJIr
                CwUJqBhflXtmgQt3Yd6ZkwSlFEu+E8Agyxliu5O3bHOqCHLZbMW/jV8Zj/ZWO6a+vilai1CUSpsR
                mSNAzgx5PhIho/WSkEk9aIoJA4mpglWVyEJHLNKQSGbOp4OXKSSOJRZENuPZzcTyAxNIsqg6jOoi
                nCTCTAJJPWiSJmZnsN2cvJo6+iJkrC0zBt1CK8IO30V+0vgYUZA8zDm3cwOigJNZptMYCvjFI5GW
                TzWQ9gqJeA/wcwODOXRDG/H4ElUoJFRtSTKFJizONGib16UGV40v/8SfdEENNEM5oljeMhySd3pQ
                xrkS5sWnfAqEGDsGndarx9+21jLP9NY09L7Nm4BfPGjENYmy7IkDdAqawWioTEIDKSpOMoYiHGjZ
                KVRYy0kFhCjoDCIhtxStTpWMdjQGHHke4LIeb1pTr0IHfP6pbdUkkmd54oJYNQ+t5NVgRn7WZI8Q
                jHyPqpuHP7IQn8v87GfxkszDjAXLmBaXYhKGFDyvJ8ZPLEEU/+MkKcRzG/DKlzCQ4wblwURAKXCh
                ZBQAmmV8YoDCxsxSm2H7GjpAQ86b8h5NIi2HEy7Dg+6Rg1uEmqoQ9FYL011eHSpS0mDx+CQ3v34d
                Wrv95zfrS9ffEaF/YcxcqRkxDXsSeCtQ0o3BUgl1h1iEAVA4hJcqg+EqmDxBBbRJJOiyN9kkxCP4
                FYJY7qI5p+i6aokq1BzOZAx1JUFEXM40OBANvLkrE2u/cWTymGOmKwLA8B2oZItPHGjcvXsJAiuV
                dvfsx6MT8ELMwYxW4obMDQzn1RpsWWz5RAJPWAMCkRwsQF3D0iL+opLsQYXuSmQjnASJHflYQfgc
                ObEvvNlgptTYLXhYDkS2AJIg0TSpUYQaI3VloVAWLycJOWg4NAFr3lpNBHXRHu3UwxfshIHDlwGB
                fPXULjs//eyg2vKGS+ffE6zh44hoWDxyGniz2iVVsgWJqiFdmmm6xswvsQvgi1VA/FxKIp5HoT6D
                WO6iKeOlcCsW40a3z6ngGFMUoUvWeAYIwTJ6ZIYFGgjsWHBwEmglglkuoumNxZgKoKEnpaY1i/ob
                hw+Q5u3n+Gn38zwPm99sPAwrHLxRu4vu8QRnp6I16dRClbK0RaRI0tokbnE3tIwJYK7UI9IIgqJp
                JYI4SSD4HBnwQcc1G21HtsqLc5E1i8yE35kysKpYpg7iiJzsPUfiALu8mPu5LIY4s79yFd00OoAu
                tmbRBq7YrxNUO5laFvX76Kmxev4PqFy9yqVs8ePcXLx414+ZAq8CtD7d9ibMyGzaBnZX754CGe3r
                iFR3St++cvYfGAkejnGISQlqZwUdaHO18F/hIiKqeQ2+I/msqbTwFAKTFEObnXEtIsqYxdKKVQGR
                OJUaKZaKV6iiVdEkvMEkvvmauJp/qLJ10STkDxkpAnty6iTkbnJiYKoHoO1NRHVI++KEkuxNQZa3
                Hm4p0f4n4+2g8Dy+e2ZvR0FJi7wF9ZB57EAsEk2kL4Qm7RmL7UwGzfvlACQSxVWpxQkUQej7u97s
                jAQhXDNoJ0IjB5EmBCiFniKCVRRabQK0sJ9FsM9cQotnom0S77vzP1WEtioj7SsnBW0UYkaYOkbn
                0Q1c4Uga27IssjCENSizAjsxrzUvvj9PqdeEbi/Bk19sc5qr+1N6/e4Nnjp3j04BG30NGje/dI0N
                /G+X37sHrEcNw5cwbzohMw2tYNI7pbYUDL7ohlj+2Sq3GUE8BeJIKrLAlOCR7ciQFsybV6Ejhipf
                lII6bNpbrJpZA4hcrDtEkygSSFWDWWdAkTsTEkehmbpFM9cPqFysgmzvtIyRELy1LQICDdogRvKX
                X4Khkj0dwdAwtqcPTYOZy8dJsD84+0vwUs185cxfz+I5HbzQLBcgrUqyj2FyjAm1yHBQHFlSoinn
                RMEgEmkcASo6AED6Jke+pFtiwRWByYu5KkXkaVk0Epj91zokrNospjKZuEYbYcDxkCiiDov77U61
                ij+MgI4U107yNQhCdRvTMxmh31YlueEB5KmohWNkSORmtUNOuOqg59UWHlhiWjxuH506fkvp7i+b
                NneNHYyK2kNH/kNOT6JSLc2ht+PawQ0dUUSa1bIVZDHSlqashWVUcanTdPhlyKSBOVpNcySXOEU7
                m8yK0y8LtRBwmgRmYRHwtl7el7HypHNLFmKpUrlfKcRHlPJpCksyiSXEkysWUERY3hVBdJdGwOMX
                QMYxUClj8xkxsxkj29WhKIrKUIMIr6SOxqi5EFA3Dm+J/bI4AB6s3bd98ErL8FLMzO7zyIRcl5KG
                vWknwvGzchhhFQbyM340G9JJPAUkz+N4ZcCntUJIDPHpMlvcKBhQ0oSXMVE01MUkCsVMEXoII+96
                MKZ6mMRG8/YpUc1lOpotl4QyBdJ5Qvjwg5NvVQCcH03o96rysDEkUJEdTbM0kcl5JrKKdUIKOIeA
                JWkLoGfI2bw7GVCdw7d0JEz76I6NwTXlrGsOarwoyovzc1qgc1cLKELIpl5On/Siim7wtIYwxW0M
                IIZT1USikSkKXJlTBhT6EtaYkAYs8IAhDTa3aUXKkDhApECGa3Pug41mFYeJwlI4NCkZBCZD4SiT
                FjGGAIbHEEoDAqLxsBZwNwkRQSe0rzYMOXRm9iHksFcm3tO6GBGG7LvMXcKtsssScL2ay+psTef0
                z0+7t33Pq2bylKe/a0EVU1Y/DmzR9vzvFVsLA/Mt/8S/o32Gx5Nnur6fWX9OvjmtKxVRtweuBIzL
                N1QbqIGoQKy4ag2b2MUGrcEjEhqkmsss2tmI/2IIA4UOHZ5uN9SI/YswEqovA4aux8ou3+1KvqqJ
                L603lqKNURWCr4MsgiFmJUze6ystl4geTzI0hQR5AfD2erBFAUxXp1MAExiS+JfuSyaikMH0xsN4
                RYr78Sha8KbAcNMVhQuG9OxzjQdd0IwG6SsnAjMHjwZUlTySFBRg7lPAUMJ1czVKCOGml59KNr1K
                hqopwYsoTOl0EskkwADye3wzUuMU8U/cefIiB3YkcXKkOggjy8OYAzHcLAwkBDuoU+s+kdSdQBWG
                SUIJLj9kvwo7yzOUAexEqBdH5XAhpbfKcT/dab6iuylTH6e3uhNjIaZbEJyItPQV1RJQZml2JwWh
                lGk+udUjAQE4sGYlBGP2SHxiLU0RPu5g4wp4CEJ6UKS9fQPxTCXwULezg6MrYQ0SklKK8egdkTFm
                D5pEVYNGoWloyfgyWT5mP+hLmYP3EeJjaMR01hJQpSslCf2w/D43NQ0M0aaar6SKZGiafeFE49hN
                2rcCNlH0lUW0qNWc8mdhNYQqiifEV85Fh0Q7GnHaLNOsJORYEYRoJcmDQyqeL7U6M3UO9m96CGUh
                pBTFFLojiXKjCZABNDFRdFlZ5I502SkicA8kkXSVNlS3GheShdN46OKaRUT5pgGIFzCKX+0hLI5o
                tzO554EmA8BHSsogCRivIIooiNhaZs/IedI4pcYz5FeFWkwSqJYQqo4StaG2FNajRmeDohTU2RGl
                hIukXIzYt1oLwxN+RJbtCX2NFLUQm2bCheRRHBVD5WtlAqO7tLnEYdIpHqKY4Nz9N/k6hs8XQeb4
                oqHSkltDNGjKEuQgjEPgQWJu6dZKnzUZ69yCX7EMs60PmsZPjoSuXuTuV3E2rBQ4Y0lLgqCWIVuE
                urwImnBHsCry0xb19FDbRT0IYSTxlWDn7fB5affvoZ9UOnQlZOHTJEuQqkN9ooa8FUSQtdSAt0o1
                7US0WTkha6C1XRXU4ZvenCPei3XmxeCv0vkCKXVMpYjpwi+WByQVRpjD18yBfHy8qihIGFfHytEo
                lRqjB/aqCnJCAZo7F0ctdOBGppIpAaLJOAMYDc0HASdsPJpYyg40dQQ3FgIapm4w9sEwommuPE5Z
                Ak2QSWIGIZRv+swdnQOIsoGFgaCKzj6b9jqVEGEViKCSgJBCZuHIidh35nDc7Gd9h5GWNxO6IQWA
                oILLXkCgaxVahJt8yLCGhiW8rznpFDkKSvCT8RCVoB0xTU0ASeArOeWJ6Xj71Dh2NFWSmiOrSBNT
                Uwt0UPT5ZCYz5iKCWQm4zl8xFJoImihvel/4fqa2BdbTk3neHc4kVINGpOOpDcGHUufxGFywISw+
                SywomN/BgwCSwupIW8yN2G8tUQx9NEIk+DGFoFwRJyXETKxrNY8MBWU+9AbliVGNLdPZDzCL9nXw
                HLT6gYOh5S5D74pOgVyY+2IMrvQZrDggpvoyiEnbICHJWV4KzYtN2Ig6wINkSR9mI8YhFlJMuoIF
                1GgWOWOKJfdvPQnyIYNpwfQZWeR/pisEgLBRRWZgqUCUR8DI+JxP65M7mHsp7evIHB3t7k4yWQQg
                1bKRRiBBVsFLmGkdRzGki/lNE5k4glwui8gdTojPYjqELiCKRxssrEDCxiEIcjNbQ/haFsvCKD3p
                dSGki9cwj1eLYLGxv3YBtuhX4ARjCxEZvzGkZ5DySd4kufA0l/JFGey+j6NRSJDKDrVFC5B7dtiW
                tTJ3KAYQ26dEA1wnU04EH1ZEcskti9C45vXMf9xmbPsVemGyZlpsFbUx2OVAY3Aoc3NV4QdYhgco
                Gh9BpJLs1XIESJl3vTf1knomtsHDEakWwhHiqPF69pP4UoYpVoOXJZ5LodqCwO1Gl86P8+JO7D2C
                xFGSVqExFXDgYU7qYuG3qgOjWlNlaheuvZtTeWrN3yu+zyVWapHjUZ4tR7paih1OUFaEMZ6kE9rh
                ddxIz8aR/qGTbkLx0FfNiQYrckl2FBGWW7n/mTZoiUkEcigSBaVsjd2PKVIdQTULwJKOEk+tJJHB
                bJUURBQjOKkO1GPcJdQwNeJDQLQgNx9vAhXD9+nOuVQcQe7GH8gcRSI4hCR0gLSbNQhETnjCBB7E
                WJRVjuROHe5KqCiQ1DBRRhkcZgvZvlk43HeFCeWa/Npe9r6Fx1PHmU0fE5BJgkAh8DCmMWT6pkX3
                KP7iRMHUmIO5CbcCPAh1C+M4kBKohBKwm4pfLKyFFVQUmblhiflowj82bj+f17mFs3AE6KCuhNQJ
                g/ciTX2Gxtt4kD6jCquASrJk7kNvhcOWIogui/VlQ2ZzYnmcDnSuf3Ip3jS+LcWSCPDDcnDij71q
                /FvFGj0D8wGD5aunChjusl4MGPOjG71+ZN5XKnVxae2xBobIkB3Ym1vCg69CTQOxFQrKhsltRR7M
                mFuRCb2vGk0Y06qR6VTZGuXVBWh/dEFF+zr4KlYthUiFG0IqBK11VQRluqYEcNTbiSa3BQV4Ez9R
                5PI1146lPS1oM7od1RWxeOmroI0jVGpH4rxJu0QbRxC4S1MEQQ+dsAbU2EaWsjycAQabqGyG/RGv
                nG7RCja4Rgw2bwatECtkYG6EPHDijIxZUzZ3DhwH6ktzFBtqYGCqgSB4lUMZAauZiN0RCrxGsoI8
                JAG4EGOggy0EOorgEidJshQq8FQpu1gAedz1ZPE04tDAiIRog0NKJrGyBdQRXJxBJJJHZjqWxhVF
                ke1GChRs0QZtIWXnrN4KxBPdjQGC4GzSlvxghu2QJxLSnfbYxRZmKCQgJ2UstmSO/eHkkdKRx3ss
                PJtauwlZgmzd4afam8A7Iz8fTRQ7x8/hxubTrB1agV/Np2wNLJk7F09HCkeDjDvrkRvOh8Ac2Mub
                Xewg2o/lq0QVib9vDp0gkn9+yhUP4psgID4dGuAzxatIR/CxOENqe86ulTWQ0QRvXH9lZw0tWBja
                4WrLU14KpLoKI2c6ZQ353qyMlAE466atSGSnBUkIWlrAy6k3hvTqDikXuKS8nlIqmv2RfBwtBVNG
                ACJCSVoCTUgBqhs62UEPk2jjiwZi1uXrqIW5cv4faVy/TK0hUu3WTp0mX6/iruULp7lb1e4RI79j
                b95w4df48+s6VR79MxD+iYu/S+6Rj6P6Vr7Nw3bnBLWrHplA+uXcPVAwcwsGUbFBO9FlADpxFtRx
                GrHVi6GHfZuSlx12Ln+pg+nPM6nY+d99bVpu/uUh7WDhmORDVNYi1iIgKKj7wiknr2pN8pP3Q9Vh
                a2W/ot+tz036u4fY3KQ+e4f+0KtxvrfXYu9nr9Gu7Rbyy9IGC8fvYMD2/f5q577/atTyuUs42ebl
                6i/Fy8yK2z/4yOZb/fYOenxPJ6m83XZee9co3Lxw3KK1tlkrHL/Tt3cJ1+Z/lhxzaVl8pN52X/Ye
                e4SZ/Zda9fojLT+xv0ytItqp+bV9h3l3Bg3RoU2dugF+mczsRGzciDyBBYIuLT8e57wFJYORo8GV
                WokEhSIx3Sjvx0gZUjjq9dhzsXz+PWxXMEkCbQPH/8mPsfK9ANqrC7N5vWb2P2srGRu+v60dgs/c
                fUAM/v/3oFyxcPHnJ0/SVj3986cgij+loijbQRux2fSKI5gFzk6vFjcf3MqV/tb8SOf3L/13NMHz
                24/0nAvW18js0jRiFZVx++5K+DyFUysER36oirJ05wILhx/jwH9q/liZWvkQD9/OYtrtzMXtA1Pz
                +egf31Z+vJsuPYDuy3LxIIqdEZSK5SA37czZ7tzPLo+k1ugjkzdnzjb3bmeET19vkSZ+/evMXLZ4
                0fPn1oA8r3NQLIx3yxpTg+f5LyxcOHGB4SAUsKXNqShNAnlpYisITGpn4fWIqrRkFaUgQFSgbEKp
                2Isr21DZDVty9K/TwwLCsRWxbNwfXzZ/HsQVPDsMwlR4ehJJMu+u4tNxI6d+worCZf/urlCy7Dp7
                ZsQ42bF2b378/9hxnrQWMz83Bmzz6uItgMd1aRL6miWeXfOHUCte7OyG/dBpEkWiMpyokiEcgmC3
                lrqyO+rxk2LlrArSLArrF/x05MGjyYOzfL0xUCdH1FCdd4TCtsHDceBV26IUqJIgTy7aGyBDyhCC
                4kSmO6dcOYtBSUh4cj09eXG9H93Fj+2BMEbDHCDRVVmJmS8alRVjYM5ZY2ZcZAwpZGO7y9aZd4Vo
                5TBw4h08kL/SMTMKeuHnNGjcSkEUO455GZXTp+CqW+odi/rumR0p/evceYwjLqkFe5a7COV0eaZ9
                emzXhPv7FOuGX5akwZPAJPPyy3fpXYJNjDA+GensSE17nv1i1eir1bt3I7nbEBuQOr1yO5U2/SSk
                poSSDRJXaVJFEcFPOdYMmvGQYxEnZCoigDUujdKPWhSrXTVEFDbgYObN2Axse/Rj3LWPc2zeBh3R
                tv3rzGgS2b4E8N6dCxDY4d2Icnt++g1M4ZqX2tsX316g//AgYnpsCORFtVUDieP3mCkwcPISM4BP
                t2bOce55jVrxDW5HICFRQRRL0gkkRgKBXQl0JNW4rUupL4jnd2wNVzZ4hBHiDQyQnRfn7cM9osTz
                GBfvBzsOU+nyEgpZJo9iCBGErRQJRAjqIPHvwpsbXru5Norgj0weo5s+Bm2hXH9u//FVswl8L26W
                GbT01OSEZCtx7cNX4igPf38ufyz+zEjl3wN26LtXPmc5/Zrh1hPcxhp2eMzUuX4/Kx4xx7XaY8f+
                z1B7bugJ2+MdbNXcB9Zmzp3b4rCj0oPKdr7F25Gn1IrwRZ2+LBnbvkVq4hxjsQ5m07Yf3SFRwQKo
                uKYExaZcq4cTh75BjHpuOHDUd8QADn2u/fuIlCT/qPjDK6icmhBYl7bZ4AEiTkA2LTvg8sWQMbIE
                bRj4KiAGoUlrYnMdSTGiy2TzfcuHCOo+HXxBbPnjymHt00l4QVyKZLK8ydPJaj1rvkkhZNm4xZ48
                dwvvnRrduocvfGipGjueM/2j5ybXNGjMC+NWu4xjh99AhyIsOxb+d27lmfucWFsJKh0JLAEkaMEi
                cnRAQxTAC9d+Tx4KKjjWl1NXjx9AkHiOUL5mPOlCncCo0sTzmxUShPT+WY5dS2bUgxM4UnRXihQj
                lEULlCKSrwoUjJU8RHX4qcKoO8OYBsXrMSW1Yu5240sgZlC+aw71nZ71OvHRQagVwXV+4adxauRG
                kPC7wkymd2isASQSJ145x53Ge2oHJUxx7IdvXiPjNj7NNILvyjezxC/xmUmonHH3Z2Zy4mrJsZSt
                z9uWtsW7gIrm07YtLAQRz4Gon1li1YhKnjx5POu8IxR0VRPjzsbLnj2eOvjN3rysswdmgDx5IPSE
                vlB4Sgq6Q8OokLYUQeQ4MiO3EJOfjFZXwfWHIGE7NQuKmkpAA1CsfaUk/uQv49084G90jUNT66j7
                qMeFhTlDG1dgD3P5bBIPOeHBWz97+1R1QJZY6uGJ9X2FTprECUObYu7efHnz12FCUJMTi8excHls
                XELM4UXvoTu0UQQELF2V6NbHSWjStIIKZdO1w5+eWlU9l5s0NCUZ+dy9H2yc2bkN6jB/xE8gghoL
                FnmCIJiGHs+SZpSfSSkICjvgaekF//mCcGjp2rVqMuOg63Tp3mljmf3zAEowqLsGtx07Jnt5esQh
                ExB1uWg9kZavhYAsvmT2B5jtgupigi18aMlbuawOasrsWJYWaHtm3HwnETftEwBO7QTt0xODiKu8
                auRYuQZG6FWxd+0SOfG2OWAcV5cOjWhesYlw8fwcT6eoyg9nn2IV93b91Eio8PtacAbaVFFDYLoC
                KrSF5EAL+E7O8DS8HAUXQCHhSkRNCnE/XkqcCar4KYjt1JUJ5FI1Xm4PQs2OoYYkppk/5gBXBp1h
                pLqwfiHVuCgiqZgeIjMBrv3Ue9mw+iW7XDvvnzuO8WFffDqvJKTkuwHsa+O0nhcn6QPw6TG3pPYF
                ldVAhHAogPgTVDTQOpfBHiCChhlNg6rv703dEtW7j/c4ldk14/5qk8IgYNKVlcTz2zaSsyOpnCnz
                3+ye7mEujipCixQS1yRW4kms1kJNBHSR5PyN2wub6X9h9EroMrfAxNsH3+Iq5cH8/98f2NZSuR1d
                PsE1jOkrtLNGmDrXOb3BBjkWQrc4RRZ2J5WztzKsKMWxEzCvGQRDKzfZs2oRuFstOHDuWu+5zC5Y
                BWbTE6Mp671qHly5HQpQdGh8fiKbH0x7KyY9nvDCwN+VnoIC9EXUw0Bzb2/ed288Y1RHi4oAUxcz
                NiFXUpOcjzFCDG5sSkFHynZqkeBRlpBSiTwG1OYOkuRpQvUIOFjADHdjbNsGchsoeuCeZWDeL+x7
                4LMGoDb3V9rM4pwfLYdGQbd8D/196VR0V15F2RfemmoREEIcgioKgwKoqCooLs+77T0OwIAgrIpg
                KKIKiERIO7EeOSmGSSmInRmHjQyLjExLglKkTUUYJGM0Znkpn5vju3Hmdmck50kjP/zPyROqdON8
                3bqurWvff3qt6rqlmzcYNRxrcM/Vb6+CFcpkALpUFU9O8aVyDeyhIJtjboSEuWXuZ79dOzaMvNwq
                Xek/iBlfxOaRkSGbGkGcqRTMDksJEFu6QyfI7U0EAAv6fZO2JTQSG665chlZ6kuaREuh6Rq2Pj0V
                lEPWblXf7gQxROckeYFsHGiEpNxhK31pN5DDEsIB7cDzTQl5ZTma6lgVArK0TQTwUaKRAsQGrjhB
                M7d0vHFWb3ZNdL0vfBg7/DEjKWiAzF31d6epA3zglHdw9v++S7R0jzmISZZobY3VIv/daamobi8a
                7SMIdIp2hcp2pqYTLl0GuSPTICfLDAVIlXikul7S8dfAeZjuMRYmSClfQgG2srkRHki7Cpk/HRW2
                9IsrO5shxTaBti7MbihQyVtESM2Pcf+fatAahiwmHHsj+nbQhTgkVfR4YRYkZjSfV/BpZagkVjhD
                4s2QMd2EAebBhx+zqYFRllYYYzRw4zBLuPjWlqbKmolfYTF6O2dYBKYYZCYyWWKkajXE+BcisbfH
                H8OB6TWbaERyKCRjnK2hzdyyqlfXraW1BoOwYdgX485hCunjvDqCAEZw6/L/3/Ec+TQAZINZAjUV
                fMuBNjG5rSY7GBBEuwhrh7Sc2VK5GgtEQoGzbVzgGntu+U9l/LXlYW6CvJx5c9xygH7vCh5IQb6i
                JGuguqjVhWsHjUU4wPiYWaxBBBkBjtJWBEjqZ/y6AM5ugaoMTMAmu95mCt9xy0+8yTziHyRpUK+3
                LV0mKV/QR6mesE1HjPwu1PTkv+rtTHEzN0RmC+ubHECie2b0Wl1yw8GBxeYu4UmWUm5XA2feI0mQ
                68+emjp4cOAkMc/+ahQ8hxcEKkkTFiR1vB30wJD1673xhzvL1tiyTnh5ubpBHpKBNT+FOy1VOnIc
                VzBnIjw6UIc5CSl8fOM5qG1ooSZKpnhBGMLkfSt6Qv/A+YRdzBbVizBVojZbDUl2MMG8RNk4XUG4
                kA3ZFYwEotnzkDu9l71wSHIdnaDlvzC3GitR05xibSentVxsZoV1qggTRbpK2N1XO80J2egoYJrk
                hmBBKuoEG1UeJoe7MUhu7NUmHJKCX20au8VlWCYg83FE35DV4rK8er2XlII20m09gmyo0RSo8RxK
                hFPHi/QDTqCA1p4lMiTVqSpiESqcVJhqY0nN44tv55rImOgpfSBM1syBZVKhJdHDFfpo8AsTI+I6
                BQPR2G4cMTlMTYifSkAY8rwCPmBsezQdK4nVpXH/k8TzlBu9zCGhUEZ63FGLzL8LmndjkaJ05GpZ
                0d9qjV2EmfVOrsBJWNFZrDArGrrBjq8eMwR5vnoA8Ua09uycpEmoMdyn3noZsmfnVCLBYoZPCgj/
                LWEoOQ+tJ7ahPMzFjXi1h/GSiwtkUkw30xYBhtKEOYTAY/Bh6pLk7YXJSH9RGhSFQQTIwUE5WjEM
                A6m6arA3ceNzc6EnULF9LTeEDJUFmpqQdjfRl0qBaCWeaFxGH3b48QME+/5f8MZvkblrZsggYlyJ
                ySYSnAQh1fYKxLitZEIAscYcQoggyTam6OMIbXqSYmKOL3LDbgYkYatYYECFmogRRfwoLnynRRaC
                pHvhElRFsLKcZiDEQDhZasiOwsrLN3QJPMGBVKJYp4XLVcDrWBDIUKJXIVJkimXIhh+GiZIfy1NT
                CX1yQmd4cQmPHs7Vmk5ixqbzrDwUzKZ7bRKCQK2bC0RQobdBYZ0svYFHMV5vDSk8NTUxfeI/UxT2
                R6H38NMU/EgGDRJbsYIJaVF0Pgic9YbSNEMWSPZZip0hCr4htjsaklSuSjCHBrlJlZo8raEaUWz/
                HarVFibY+FzzkgnZ0lnHQfRYCnjrFGjJk5PYoBErlvnGwUUs2sECMzRYS4g2xqikTWX7RcgVBuE8
                nyhrEuEwnSJH7PZucrtrBADsGRR3OeTVlOpZRKI81iUJB1GiWXIZ1eS7xnTsX6iyErzaNhd2M9TT
                DQxjiFHHamJrAjWK0JJgX319XWgzbBr2mghHdQLO49eCix2NPSM8FS0dpFg2sEE0MTWPKCXEnJfn
                IWQK6DKEMtROtrIprhZixRGy+G8tkDs5gLyUCV7PWN3KZVXxtNbNgygitbb3imeraIPthj07i/io
                DL1RcTsUeigShvoYY2yE1RSJMnZtAtZGPlkipTtcgqRjIEcF9fgsOfVD2XFenL6wpglCZm+ycYKJ
                BiqESSjgLxBEsczXiYjhxRBEcsGy7GdRrCJ3oiyHkawlw8+LcnYl2mI85xKpKdPZBsPwUhirHwHq
                GA5wgjeGvI4aczCvGWzsh1mYGc8R4ocPVApfsc1HvMR7NPKNYHxGKNbwSa54ahaXYwVswOwjLvIN
                R5B6J+ThAWe85HLsPlNBd3hFvZYy4B7KNnSjk347WbEPQKzGa5Z7Gs8ymjYUamCCWTB4kJTpTYUO
                HLKBMqEQVShrPoZ8R85FLKUCFZTtycTGFO4O9i0ns42VBMaxDTOpIJlBiy0jxNDcnDuMp1MVauh1
                EGWlDqasKUnsyQDKXN82poGUGD1+LuE/Zvlxl+pgzVrttJsMih0DeBPZHvxgP7kxWiSXkCJPFEcq
                qODtLJKio2morozWdvX8ILrmNu1dPAGh0NNBJkpczZAijMBbzwAtK+mFaQywKIKYSlLGgzQdHKHr
                yMvX4RDexC/l3K8xdoki10TBCnq5AWJBArq83n9XjQR81ir51PKQi3skWiwwRkEhC5U7yQNWUW0q
                Z5QzXbF3lhEViaV4SaJcuwbFkbampaUVe9Go11bVhZswYrq1rQwtxU1oiihDwkzotBFBs+enYIkh
                fEYnFGMdqqVqKjtgXrlq5GZ007Xlr2PHas6sIrbdvRVdeBl5s3YeeqTdi64kVsa9yILfzsWt6JDf
                Xr0Vm/Fu3VrajJrUKKfyJCPQOhIsjS50UgdNJMhLl78nMq/BlFBtk4I3SMA/yNzeHLjhPEaCWOkp
                rGnE2Gy2P588h8xWzcfGY1f0vRJAsRbGJVf/HynjjWSTLBFEWZCmCbzWYbObN+rdlmljTOJgZkE3
                ZWHXY6Q0NjKC3t4DhxBrz8Y5BUWIMfnvEuX5GeySzV7QSLthkMtOSwoVueSLQvIOoTKBXxvJB4mk
                pxY0y8DFk8+JRNsJSMGIlKfi7nxbTpaZIpRmI5maaMgMgnovNJhYU0ydlko1gCKpkFyKRxLGBhKn
                l8sUhEGY1WAXuYmI+i1jKFSs+C8mOJIP3RSLSdiMixroibOB0BTpMRN30O8kNiUZmsRn12MZoWVq
                B5cT1WVTdg84ubceXiJTS1r8fAzVv4w90h7Pvg9/j82gAOnTyPzv3vo+fsJZy/8hU27zuCA++dwM
                2bd9DfP4C+619JefPuN7Fu26u4cPkaPua2J5kHB7/B0NcP0H9jkPucweDd+7g39BD37z3Eva/Fkw
                DDn0ODD6Ttzl/ox5Fjn+HLqwPo2vE2Ll78Eq3rd6GlbRsqq1ajtroFdZUrsTi/AovSirA4JQ+lka
                lQTZ+PFJdpUDtPQfkkT1SR2Sod3FBhOwFLx05E0WgnpMitEa5vRiNrTN+iQABVwN/ABJGUxiCFBa
                aTcSdT0ibQkDsyqhtrYwOnCRMw3u03zNPgHx6PpNxy5FY0Yfnzu/DlV09f7u4f6algEfNtz164Br
                eZwbC3nYRxJtZwMzCFL2k+hlqbwF4eR61PIYhyqHWZlAs16bSEYZgATAV1spGgaKG5aiAdlhEcud
                TRHOpkDgGXrENTSdQHcLtQSlY0fU02/UTpGDsUOLpI9x/ibcchdZwbCknpC4OSkOEXhyXpJajMq8
                QK9vSlixvQtGIdOjt2YHPXXhw/dgo3+gZw9swFbOl+F8d6P5cKfv3Wvx6JGPz2O/z1b/+HPz75M6
                7duYfHf/5B6hj9d+5j6OFPX8Q39PAR+u/ek7YR2z75EUWLOrpz/+cfZhNm8eGjP0nRz+A34p20/4
                8bt+9h11tncOnaLfQP3MU7h0+j9/RFfPjRKXRteg3v0mSePHocTUua0MJyvlC9Ch2LatGWV461ua
                VYm12K+oQclAQnIY8slRcSjxya0wy/cCnnhSRAHRyHJL8IRPmGIikuHcmqPMQwv7B1B/a+eRC5Na
                vQtfe3uHj1BjbuP4z+P/z8g/NPBYtIYsee3nN49+ARlGSVQs2LyqRWq5ynIsNmPE2aLaINLBhSmi
                FKS4EY+gTxoFMSQzLVSB3SpC6WMiKplikl9okjmKJJncny0ciycULG+MmIcSTtMsRNneyOKt9g1I
                XHojYtE2WZahSlq7GhrQOHeP69rx3CiZOf4sVd7+D85T5c7ruFS9f/la/03caTPw2PbIvGuXz9Dm
                4PDt8c+19NfQMP/vmu/PsPH+P7H/6KxyzD5b47ePDHx9Ic6C9Yzi+u32S+gUtXruPS5au4zHzxwh
                W8TkC9934PDn9wAhu2HUDn5v3Y8vIBnDn9GTo37MHZs+ex9eU3caL3U+x64wjaWXdvHz+Lr+4M4f
                a9b3GOILn19fA9oS8Ghqez/lx6Jlh+nPqu3cTB/e9he/MGdBTXopl0WeobjTjn6Qgf64ZQG1eEWL
                swOyLK2oly4YwkG3tk87PYyQ2Z4yYjkt9Dn3NBqrs36uKy2Fsa8d7e/WhcVEldX4WdqzuxY81G7N
                r6Co4e+xinPjmPofvf4Hs2vkC96MmfsiJ/TcNJsN4jguu7J9+j90IfTl3sw7Vbw41++vO+YRD035
                WmSd5kx+m9cAPfcftH3H7wwU9Z9JekXwQWka4R5b0ff4bTROehA+9jT9ce7N+6F3u37vlR3s3czd
                +78Srz69u68cb2buxj7mh7HrVVTVjd2ImXNryCg4eOszf9BTt2vYVjH/4ep3rO8djn0dt7AY8pE7
                +m/730i8Hy4zREGhsc+umikv8u3adfeP3oabx+5CzeOHoOBz74BPup1W999NkvosBf0387AX8HKT
                CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
                </br>
                <p><b>Dear ${data.firstname} ${data.lastname}</b>,</p>
                <p>Please find the Login credentials for your account.</p>
                <p><b>Email ID: </b>${data.email}</p>
                <p><b>Password: </b>${data.password}</p>
                <p><b>Enrollment No: </b>${data.enrollmentNO}</p>
                <p>Please click button below to access your account.</p>
                <a href="https://app.thetncollege.com/" target="_blank" style="display: inline-block;cursor:pointer;padding: 16px 25px;font-size: 16px;color: #000000c4;text-decoration: none;border-radius: 6px;background:#2289ffe3;">VISIT WEBSITE</a>            
                <br/>
                <br/>
                <p>Regards<br/>
                TN College</p>
            </div>
            </body>
            </html>`
       );

      // let config = {
      //   method: 'post',
      //   url: 'https://api.sendgrid.com/v3/mail/send',
      //   headers: {
      //     'Authorization': 'Bearer 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',
      //     'Content-Type': 'application/json'
      //   },
      //   data: emailData
      // };
      // console.log('<axios>')

      axios(config)
        .then((response) => {
          console.log('axios response', JSON.stringify(response.data));
          return {
            hasError: false,
            message: `Success! Mail sent.`,
            user: response,
          };
        })
        .catch((error) => {
          console.log('axios errrr', error);
          return { message: error, hasError: true };
        });

    }
    console.log('<auth>')

    return admin.auth()
      .updateUser(userID, { phoneNumber: "+91" + mobile , disabled: !(status === 'Active') })

      .then((res) => {

        return setData()

      })
      .catch((error) => {
        return { hasError: true, message: error };
      });

  // } catch (error) {
  //   return { hasError: true, message: error };
  // }
});

exports.deleteStudent = functions.https.onCall((data, context) => {
  try {
    const { userID } = data;
    const deleteData = () => {
      return admin.firestore().collection("zSystemStudents").doc(userID).delete()
        .then((querysnapshot) => {
          return {
            hasError: false,
            message: `Student's account Deleted.`,
            user: querysnapshot,
          };

        }).catch((error) => {
          return { hasError: true, message: error };
        });
    }

    return admin.auth()
      .deleteUser(userID)
      .then((res) => {

        return deleteData()

      })
      .catch((error) => {
        if(error.codePrefix !== undefined && error.codePrefix === "auth" && error.errorInfo !== undefined && error.errorInfo.code === "auth/user-not-found"){
          return deleteData()
        }
        return { hasError: true, message: error };
      });

  } catch (error) {
    return { hasError: true, message: error };
  }
});

exports.addToIndex = functions.firestore.document('Questions/{QuestionsID}')
.onCreate(snapshot => {
  const data =snapshot.data();
  const objectID = snapshot.id;

  return index.saveObject({...data,objectID,id:objectID});
}) 

exports.updateIndex = functions.firestore.document('Questions/{QuestionsID}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;

  return index.saveObject({...newData, objectID})
})

exports.deleteFromIndex = functions.firestore.document('Questions/{QuestionsID}')

.onDelete(snapshot => index.deleteObject(snapshot.id))



exports.addQuizToIndex = functions.firestore.document('zSystemStore/{QuestionsID}')

.onCreate(snapshot => {
  const data =snapshot.data();
  if(data.type==='quiz'){
    const objectID = snapshot.id;
  
    return quizIndex.saveObject({...data,objectID,id:objectID});

  }
  if(data.type==='package'){
    const objectID = snapshot.id;
  
    return packageIndex.saveObject({...data,objectID,id:objectID});

  }
  if(data.type==='book'){
    const objectID = snapshot.id;
  
    return bookIndex.saveObject({...data,objectID,id:objectID});

  }
  return 0;
}) 

exports.updateQuizIndex = functions.firestore.document('zSystemStore/{QuestionsID}')

.onUpdate((change)=>{
  const newData = change.after.data();
  if(newData.type==='quiz'){

    const objectID = change.after.id;
  
    return quizIndex.saveObject({...newData, objectID})
  }
  if(newData.type==='package'){
    const objectID = change.after.id;
  
    return packageIndex.saveObject({...newData, objectID})

  }
  if(newData.type==='book'){
    const objectID = change.after.id;
  
    return bookIndex.saveObject({...newData, objectID})

  }
  return 0;

})

exports.deleteQuizFromIndex = functions.firestore.document('zSystemStore/{QuestionsID}')

.onDelete(snapshot => {
  console.log('data',snapshot.data())
  
  if(snapshot.data().type==='quiz'){
    console.log('quiz delete')
    return quizIndex.deleteObject(snapshot.id)
  }
  if(snapshot.data().type==='package'){
    console.log('package delete')
    return packageIndex.deleteObject(snapshot.id)
  }
  if(snapshot.data().type==='book'){
    console.log('book delete')
    return bookIndex.deleteObject(snapshot.id)
  }
  return 0;

})

//============================

exports.addStudentToIndex = functions.firestore.document('zSystemStudents/{Student}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return studentIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateStudentIndex = functions.firestore.document('zSystemStudents/{Student}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return studentIndex.saveObject({...newData, objectID})
})

exports.deleteStudentFromIndex = functions.firestore.document('zSystemStudents/{Student}')
.onDelete(snapshot => {
  return studentIndex.deleteObject(snapshot.id)
})

exports.addBatchToIndex = functions.firestore.document('Batch/{batch}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return batchIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateBatchIndex = functions.firestore.document('Batch/{batch}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return batchIndex.saveObject({...newData, objectID})
})

exports.deleteBatchFromIndex = functions.firestore.document('Batch/{batch}')
.onDelete(snapshot => {
  return batchIndex.deleteObject(snapshot.id)
})

exports.removeBatchFromStudent = functions.firestore.document('Batch/{batch}')
.onDelete(async snapshot => {
  const stuRef = admin.firestore().collection("zSystemStudents")
  const stuData = await stuRef.where('batch','array-contains', snapshot.id).get().then(query=>query.docs.map(doc=>doc.data()))
  console.log('id<>',snapshot.id)

  let fireBatch = admin.firestore().batch()
  stuData.forEach(item=>{
    console.log('item<>',item._uniqueID)
    let stuDocRef = stuRef.doc(item._uniqueID)
    let batchName = item.batchName ? item.batchName.filter(filterItem => filterItem.value !== snapshot.id) : []
    fireBatch.set(stuDocRef, {batch:admin.firestore.FieldValue.arrayRemove(snapshot.id), batchName: batchName},{merge:true})
  })
  fireBatch.commit().then(res=>console.log('record deleted')).catch(err=>console.log('catch err',err))
})


exports.addCouponToIndex = functions.firestore.document('DiscountCoupons/{coupon}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return couponIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateCouponIndex = functions.firestore.document('DiscountCoupons/{coupon}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return couponIndex.saveObject({...newData, objectID})
})

exports.deleteCouponFromIndex = functions.firestore.document('DiscountCoupons/{coupon}')
.onDelete(snapshot => {
  return couponIndex.deleteObject(snapshot.id)
})

//==============2

exports.addDocumentRequestToIndex = functions.firestore.document('DocumentRequest/{DocumentRequest}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return discountIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateDocumentRequestIndex = functions.firestore.document('DocumentRequest/{DocumentRequest}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return discountIndex.saveObject({...newData, objectID})
})

exports.deleteDocumentRequestFromIndex = functions.firestore.document('DocumentRequest/{DocumentRequest}')
.onDelete(snapshot => {
  return discountIndex.deleteObject(snapshot.id)
})

exports.addAdminToIndex = functions.firestore.document('zSystemUsers/{zSystemUsers}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return adminUserIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateAdminIndex = functions.firestore.document('zSystemUsers/{zSystemUsers}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return adminUserIndex.saveObject({...newData, objectID})
})

exports.deleteAdminFromIndex = functions.firestore.document('zSystemUsers/{zSystemUsers}')
.onDelete(snapshot => {
  return adminUserIndex.deleteObject(snapshot.id)
})

exports.addEnquiryToIndex = functions.firestore.document('enquiry/{enquiry}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return enquiryIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateEnquiryIndex = functions.firestore.document('enquiry/{enquiry}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return enquiryIndex.saveObject({...newData, objectID})
})

exports.deleteEnquiryFromIndex = functions.firestore.document('enquiry/{enquiry}')
.onDelete(snapshot => {
  return enquiryIndex.deleteObject(snapshot.id)
})


exports.addMediaCenterToIndex = functions.firestore.document('MediaCenter/{MediaCenter}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return mediaCenterIndex.saveObject({...data, objectID, id: objectID});
}) 

exports.updateMediaCenterIndex = functions.firestore.document('MediaCenter/{MediaCenter}')
.onUpdate((change)=>{
  const newData = change.after.data();
  const objectID = change.after.id;
  return mediaCenter.saveObject({...newData, objectID})
})

exports.deleteMediaCenterFromIndex = functions.firestore.document('MediaCenter/{MediaCenter}')
.onDelete(snapshot => {
  return mediaCenterIndex.deleteObject(snapshot.id)
})

exports.payment = functions.https.onRequest(async (request, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  try {

    const options = {
        amount: 50000, // amount in smallest currency unit
        currency: "INR",
        receipt: new Date().valueOf().toString(),
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send({ hasError: true, message: "Some error occured"});

    return res.json({ hasError: false, message: order});
    
} catch (error) {
    return res.status(500).send({ hasError: true, message: error });
}
})


exports.sendNotification = functions.firestore.document('notifications/{notifications}')
.onCreate(async snapshot => {
  const batchRef = admin.firestore().collection("Batch")
  const studentRef = admin.firestore().collection("zSystemStudents")
  const data = snapshot.data();
  let emailArray = [];
  if(data.type === 'Batch') {
    console.log('inBatch')
    const batchData = await batchRef.where('itemID','in',data.batchId).get().then(querySnapshot=>{
      return querySnapshot.docs.map(doc => ({...doc.data(),id: doc.id}))
    })
    batchData.forEach(async item=>{
      let stuData = await studentRef.where('batch','array-contains',item.itemID).get().then(querySnapshot => querySnapshot.docs.map(doc => doc.data()))
        // let stuData = querySnapshot.docs.map(doc => doc.data())
        stuData.forEach(async item2 => {
          let config = sendGridConfig(item2.email, 'noreply@tncollege.online', 'Notification for TN-College', 
          `
          <html> 
          <body>
          <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
          
              <h1>                                                 </h1><br/>
              <img src="data:image/png;base64,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
              CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
              </br>
              <p>${data.message}</p>
              <br/>
              <br/>
              <p>Regards<br/>
              TN College</p>
          </div>
          </body>
          </html>`
          )
            await axios(config)
            .then((response) => console.log('Success! Mail sent.'))
            .catch((error) => console.log(error))
          // emailArray.push({email: item2.email})
          await studentRef.doc(item2._uniqueID).collection('notifications').doc().set({createdAt:data.createdAt, message:data.message, type:data.type})
        })
      // }).catch(err => console.log('<>ERR<>',err))
    })
  }
  if(data.type === 'Single') {
    console.log('single')

    console.log(data.stuId)
    data.stuId.map(async item=>{
      let tempdata = await studentRef.doc(item).get().then(querySnapshot => querySnapshot.data().email)
      console.log('tempdata',tempdata)
      let config = sendGridConfig(tempdata, 'noreply@tncollege.online', 'Notification for TN-College', data.message)
      await axios(config)
      .then((response) => console.log('Success! Mail sent.'))
      .catch((error) => console.log(error))
      return studentRef.doc(item).collection('notifications').doc().set({createdAt:data.createdAt, message:data.message, type:data.type})
    })
  }
  if(data.type === 'All') {
    console.log('inAll')
    let batch = admin.firestore().batch()
    const studentsArray = await studentRef.get().then(querySnapshot=>querySnapshot.docs.map(doc => doc.data()))
    studentsArray.forEach( item=>{
      if(item._uniqueID){
        if(item.email){
          emailArray.push({email:item.email})
          let stuRef = studentRef.doc(item._uniqueID).collection('notifications').doc()
           batch.set(stuRef, {createdAt:data.createdAt, message:data.message, type:data.type})
        }
      }
    })
    batch.commit().then(async res => {
      const arr = emailArray
      // .map((e, i) => {
      //   return i % 10 === 0
      //     ? emailArray.slice(i, i + 10)
      //     : null;
      // })
      // .filter((e) => {
      //   return e;
      // });
       console.log('>emailArray<',arr)
      // return arr.forEach(async itemArr =>{
        let config = bulkSendGridConfig(arr, 'ritik.kaushik@crimsonbeans.co.in', `Notification from Tn-College`, data.message)
        console.log('commit done')
        console.log('axios config',config)
        
        await axios(config)
        return console.log('Mail sent')
      // })s
    })
    .catch(err => {
      let temp = err
      
      return console.log('<>ERR in batch2<>',err,err.data !== undefined && err.data.errors)})
  }



  return console.log('<>NO');
}) 


exports.payment2 = functions.https.onCall(async (data, context) => {

  const { couponCode } = data
  const currentUid = context.auth.uid
  const cartRef = admin.firestore().collection("zSystemStudents").doc(currentUid).collection("cart")
  const storeRef = admin.firestore().collection("zSystemStore")
  const ordersRef = admin.firestore().collection("orders")
  const couponRef = admin.firestore().collection("DiscountCoupons")
  
  const discountArray = await couponRef.where('couponCode', '==', couponCode).get()
  .then(querySnapshot => querySnapshot.docs.map(doc=> doc.data()))
  let discountOf = 0

  let totalItems = []
  let carttotalItems = []
  const cartItems = await cartRef.get().then((querySnapshot) => {
    let data = querySnapshot.docs.map((doc) => doc.data())
    return data.map((item) => item.itemID)
  })
  const totalAmount = await storeRef.where("itemID", "in", cartItems).get().then(querySnapshot=> {
    let finaldata = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    let totalPrice = 0;
    carttotalItems = finaldata
    finaldata.forEach(item => {
      totalPrice = totalPrice + item.price
      totalItems.push({itemID: item.id, type: item.type})
    })

    return totalPrice  
  })
  // return storeItems
  
  if(discountArray.length !== 0){
    if(!discountArray[0].used){
      if(new Date(discountArray[0].validTill) >= new Date()){
        if(couponCode.slice(0, 3) === 'CAM'){
          
          if(discountArray[0].validFor === 'Quiz'){
            let quizItems = carttotalItems.filter(item => item.type === 'quiz')
            if(quizItems.length === 0){
              // notify('Coupon can only be applied on selected Quizes', true)
              // return 
            } else {
              if(discountArray[0].discountIn === 'Rupees') {
                let tempTotal = 0
                quizItems.forEach(itemMapQ=>{
                  tempTotal = tempTotal + itemMapQ.price
                })
                console.log('tempTotal',tempTotal)
                if(discountArray[0].discountAmount > tempTotal) {
                  discountOf = discountOf + tempTotal
                } else if(discountArray[0].discountAmount <= tempTotal) {
                  discountOf = discountOf +  discountArray[0].discountAmount
                }
              }else if(discountArray[0].discountIn === 'Percentage') {
                let tempTotal = 0
                quizItems.forEach(itemMapQ=>{
                  tempTotal = itemMapQ.price
                })
                discountOf = (discountOf +  (discountArray[0].discountAmount/tempTotal) * 100).toFixed(2)
              }
            }
          }
          if(discountArray[0].validFor === 'Book'){
            let bookItems = carttotalItems.filter(item => item.type === 'book')
            if(bookItems.length === 0){
              console.log('IN if')
            } else {
              if(discountArray[0].discountIn === 'Rupees') {
                let tempTotal = 0
                bookItems.forEach(itemMapQ=>{
                  tempTotal = tempTotal + itemMapQ.price
                })
                console.log('tempTotal',tempTotal)
                if(discountArray[0].discountAmount > tempTotal) {
                  discountOf = discountOf + tempTotal
                } else if(discountArray[0].discountAmount <= tempTotal) {
                  discountOf = discountOf +  discountArray[0].discountAmount
                }
              }else if(discountArray[0].discountIn === 'Percentage') {
                let tempTotal = 0
                bookItems.forEach(itemMapQ=>{
                  tempTotal = itemMapQ.price
                })
                discountOf = (discountOf +  (discountArray[0].discountAmount/tempTotal) * 100).toFixed(2)
              }
            }
          }
          
          if(discountArray[0].validFor === 'Package'){
            let packageItems = carttotalItems.filter(item => item.type === 'package')
            if(packageItems.length === 0){
              console.log('IN if')
            } else {
              if(discountArray[0].discountIn === 'Rupees') {
                let tempTotal = 0
                packageItems.forEach(itemMapQ=>{
                  tempTotal = tempTotal + itemMapQ.price
                })
                console.log('tempTotal',tempTotal)
                if(discountArray[0].discountAmount > tempTotal) {
                  discountOf = discountOf + tempTotal
                } else if(discountArray[0].discountAmount <= tempTotal) {
                  discountOf = discountOf +  discountArray[0].discountAmount
                }
              }else if(discountArray[0].discountIn === 'Percentage') {
                let tempTotal = 0
                packageItems.forEach(itemMapQ=>{
                  tempTotal = itemMapQ.price
                })
                discountOf = (discountOf +  (discountArray[0].discountAmount/tempTotal) * 100).toFixed(2)
              }
            } 
          }
          if(discountArray[0].validFor === 'All'){
            if(discountArray[0].discountIn === 'Rupees') {
              discountOf = discountArray[0].discountAmount 
            } else if(discountArray[0].discountIn === 'Percentage'){
              discountOf = ((totalAmount/100) * parseFloat(discountArray[0].discountAmount)).toFixed(2) 
            }
          }
          
        }
        else if(couponCode.slice(0, 3) === 'SPE'){
            if(discountArray[0].couponFor !== undefined && discountArray[0].couponFor.stuID === currentUid) {
               if(discountArray[0].discountIn === 'Rupees') {
                  discountOf = discountArray[0].discountAmount 
                } else if(discountArray[0].discountIn === 'Percentage'){
                  discountOf = ((totalAmount/100) * parseFloat(discountArray[0].discountAmount)).toFixed(2) 
                }
            } 
        }
    }}
  } 
  let finalTotal = (((totalAmount - discountOf)*100)/118)+((((totalAmount - discountOf)*100)/118)*0.18)
  finalTotal = finalTotal.toFixed(2)
  console.log('<><>',finalTotal)
  const options = {
      amount: parseFloat(finalTotal * 100), // amount in smallest currency unit
      currency: "INR",
      receipt: uuidv4(),
  };

  const order = await instance.orders.create(options);

  if (!order) return { hasError: true, message: "Some error occured"};

  await ordersRef.doc(order.id).set({
    totalAmount: finalTotal,
    _uid: currentUid,
    status:'pending',
    order: order.id,
    orderedItems: totalItems,
    couponCode: couponCode || '',
    discountOf: discountOf || 0,
    orderCreatedAt:new Date(),
    invoiceNo: uuidv4(),
  }).catch(error => {
    return { hasError: true, message: error };

  })

  return { hasError: false, message: order};

})

exports.verifyPayment = functions.https.onRequest(async (request, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')

  try {
    const ordersRef = admin.firestore().collection("orders")
    const purchaseHistoryRef = admin.firestore().collection("purchaseHistory").doc()
    const NoOfEnrolledStudentsRef = admin.firestore().collection("NoOfEnrolledStudents").doc('NoOfEnrolledStudents')
    const couponRef = admin.firestore().collection("DiscountCoupons")

    const secret = `Y9u'jcQuynb"#y.-g2kDYpKyJmYUfsE6/Xv/R!a&`
    
    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(request.body))

    const digest = shasum.digest('hex')
    const response = request.body

    if(digest === request.headers['x-razorpay-signature']) {
      console.log('Verified')
      console.log(response.payload.payment.entity.order_id)

      
      const orderRes = await ordersRef.doc(response.payload.payment.entity.order_id).get()
      .then(querySnapshot => querySnapshot.data())
      if(orderRes.order === response.payload.payment.entity.order_id) {
        
        const userDataRef = admin.firestore().collection("zSystemStudents").doc(orderRes._uid)
        await ordersRef.doc(response.payload.payment.entity.order_id)
        .set({status:'Success', created_at: response.payload.payment.entity.created_at }, { merge: true })
        .then(res=>{
          console.log('<success>',res)
          return res
        })

        if(orderRes && orderRes.couponCode && orderRes.couponCode.slice(0, 3) === 'SPE'){

          const couponCodeDoc = await couponRef.where('couponCode', '==' ,orderRes.couponCode).get().then(querySnapshot => querySnapshot.docs.map(doc => doc.id))
          console.log('couponCodeDoc<>',couponCodeDoc)
          couponRef.doc(couponCodeDoc[0]).set({used : true, usedAt: response.payload.payment.entity.created_at }, {merge: true})
        }
        let batch = admin.firestore().batch()
        let batch2 = admin.firestore().batch()
        let batch3 = admin.firestore().batch()

        const userData = await userDataRef.get().then(querySnapshot => querySnapshot.data())
        var enrollmentNo = ''
        // console.log('<userData>', userData)
        const loopFunction = async (item) => {
            const cartItemRef = admin.firestore()
            .collection("zSystemStudents")
            .doc(orderRes._uid)
            .collection("cart")
            .doc(item.itemID)
    
            let data = {}
            data = item.type === 'book'
            ? 
            { itemID: item.itemID,readingProgress:0, type: item.type }
            :
            { itemID: item.itemID, type: item.type };
    
            if (item.type === "package") {
              const boughtItemRef2 = admin.firestore()
                .collection("zSystemStudents")
                .doc(orderRes._uid)
                .collection("boughtItem")
                .doc(item.itemID)
              
              if(boughtItemRef2)
              batch.set(boughtItemRef2,{...data, createdAt: response.payload.payment.entity.created_at})  
              
              const packageItemsRef = admin.firestore()
                .collection("zSystemStore")
                .doc(item.itemID)
              
              const packageItems = await packageItemsRef.get().then(doc => doc.data()).catch(err => console.log(err))
                console.log('<>packageItems<1>',)
                if(packageItems.withClasses !== undefined && packageItems.withClasses === true){
                
                  if(userDataRef)
                  batch.set(userDataRef,{Courses:admin.firestore.FieldValue.arrayUnion(item.itemID)},{merge:true})
                }
                if(userData !== undefined && userData.enrolled === undefined && packageItems.withClasses !== undefined && packageItems.withClasses === true){
                  if(userDataRef)
                  batch.set(userDataRef,{enrolled: true}, {merge: true} )
                  console.log('email<>',userData.email)
                  const msg = {
                    to: userData.email,
                    from: 'noreply@tncollege.online',
                    subject: `Welcome ${userData.firstname !== undefined ? userData.firstname : ''}`,
                    html: `<html> 
                    <body>
                    <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACQCAYAAAA4CJinAAAAAXNSR0
                        IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAJweSURBVHhe7L0FeF
                        TJFi0c7066O+4eIMEdAgFC3N3d3V2Jh5AQCO7u7u7u7u7uEBxm7l3/rhNgmLkwwzDM3Pv+9/b31d
                        d2+pySVWuvXadOlRj+n/0/+0b7f2D5f/bN9n8lWJ7cuYejazbjxKrNOLlhG3av3YSdm3di85btWL
                        V+M9Zu2IoNG7dh9doN2Lx5Mw5s3Yb99P7JvfsfzvB/p/1fA5bbFy5j17I1WDdjHoak5CK5iyWSWv
                        dEfMc+8GzfHb3adkD7dh3QrkNXtGnTiUvt6bueHTvBo3N3hHTshvLgUCwcMQLrZs7E6f0HPpz5/x
                        77/yVYfv7pJ5w5dBjbVq7C5iXLsH7eQhQGhMO/fQ94m3SAm6YRnGWU4SGuABcZFZjyFaEpLg05GT
                        54ckKIi0lDQkwCQj4PmrI8dJEVwl5OAV4CRYRpaCOhmQmKLO2xceosrJ8zHyvnzseW9Rtx5thJ/P
                        zzzx9y8f8/+/8FWBqfPcP506dx8vBh7N26FYunT0ektS1sDZrBpXlLOOg1g61OM/RR0YapUBFm0n
                        IEEnkEyCjBg6cMd/0WiHZyRVRYOEKjIhEeGknvIxAXGQZf675w0tWl4wQIkOIhTJqPKGkBQsQF8J
                        dVg52iJnpp6aGHSSv42zhiyZQZOLp1Jy4ePo5rp8/ixbPGD7n8P9/+jwVL46MnuHXxMi4eO4FJNX
                        WItbZDcPeesNbTh6mSMropKMJcSwcJ9o7YtXYdDm7djv1btqE8Lg721PjOIkX4yCnCS0kDA+IScf
                        PSJdy+dQu3bt/GnTt3cY/SXXo/bXgDAlu3hJuUNHzFxBEiKY04WXmES4vgJi4HG5EK7Ilp3Lubwq
                        VjF3g0a4swk87I7GWLbDtXTB0wEOePHcPNixfR+PDhh9z/n2n/x4Dl3//+N54+fYr7d+/i9rXrGJ
                        VbjNTeNggyMIGbSBVOsgpwIFdhzpODqUCIiL4W2LxyJc4ePcL996Pdu3UTE6rLEda2NZwFIrhraW
                        PBuLHcb+y4y1eu4uKFi7h88RKuEIAGlxbDRVcLzhIS8Kbkz+MhRKiAAJEy4jp2xqYFi7Bj9RqcIg
                        1zZPsO7Fm5BvUhUQhQ04OHvCrcVNTgZWiE5N59MD4rGw9v3sTjO3fw8snTX+Xr/wT7nwfLv//1b7
                        x68RJ3rt9ESVo2Ih1d4N6yDfpQQ1vJyMKekjtpCi+hPFwp2QiFiOzVC4e3beMa483LV3j66DGeUK
                        9+9uQJ/vWvf+HZw/uYW9sfAYYGsFJVwdxxY7hr/URax7h1e2gpaKAV6ZqWmtpooSCAuUAO7tLS8J
                        KQhIe0DFwIjCm9e+PAuvXc/5i9pjx+bPzbZ89hSHAYojV1EKGiCm8eH+6UPBTkkdm9G0qI7SalZe
                        Hh9Rt4++IFlfFf3P/+1+1/FiysUd+9fYcbl66iJjEbYd37ortACTbUAB4GBrBXVoSdggh9ZKRgwZ
                        eEjZw0zPlSsFdTwfxhwz6dY0ppf7h36AHrFm0RZGGDG5cvc43aeO8ehiYnwUxZCTPHjPx0fGlJBY
                        rSclFTUAYvcyu0JXdmL69E+kREglgKDlIy8NLXx5Lx47j/sHO9ogYfnpGNB+TG3r95w313afduFL
                        Vvjwi+LKJl5RAuL4S3PB+eIlmEq6ohSlMXeT16YXJyKu5euoz3b9/+z4PmfxIsrNEun72AqrQ8eH
                        YyQ08RCUl1Xdjr6GBsTg72zpyGASH+sFRRRE+BJPoIJWGlwIcFNYaLvg5WTZncdB6KTIJ69EU7Er
                        JdKHWSVUJZbCyePX7E/X7q0CF0o4abNnIU9/m3dmjzVgSZ9oIdXwGeEgL4yIhgzxcixrwPLhw9zI
                        HiHTWyhbYOrJTJFaqqY3xMFF49fYLGc2cx3sEBIdI8BPBkySWJKExvhyo/Xwzy9cewwGBEt24NFz
                        VVRFPIPjY+CbfOnOEiuY8M9b9m/1NgYZXE0q4Nm+Bu3BrWfBFc1LUQYmaGyrgY7Jw399Nx62dOhG
                        NrA3RXkoGprCR6ykiit6wMHHW1sXDMaO44BpZQK1sCiSIcRZqw4SkizcoeD0kzMDt++AjaaRti6p
                        gJn679eVo9bxGcW3aAk0ATvjxVOIiRoCW9Mm/kCO7/rGEHhobCTFIC7kpKcOTLIL21CbmXa3hEof
                        t4Et2+BC53TS1UUqR1klzj57Zo9EiEdu0AH2I3H9JCcc2NMDQ6HBcO7ueu/79m/1Ng2bhsFezbd0
                        E7WQG5FlmEkmbYPHXarxqQ2aSKEtg000JLGXF0FsrATMAjYUuvFLHYqKlhwagmpmBg8aAopTNFL5
                        5KWnDiKSC2iynuk8hkdujgQWirqGPymIlcw88dNwNtjFpBjXSGvpYWdCkPLcWlYU8gY2Cxl5CDA2
                        mclR+Yi/1nSHAonOUE8FJUgiuBxY/SgC5dMbK7GbLVtBGsqoHVU6b8Kv8fjX0+vHYl8ky7IVIkjy
                        DSQ648aUR0aIMtixd8OOp/x/4nwLJp1SrkhkfC0aQVeomU0ENagF48AVZMnvrJj7OGmdOvHAUUjr
                        qpaSKgeTP4UE+0Iu3SS0oSfSWlYCnFg4OiKmYPauD+w9xZiqs72hKI7IkRnOUVkGNrg0cfmOUouR
                        IjYqJxY8ZwDffm9WtokAiVERODSFwc6vTahpKznBwxhBwcxSWIoeSxeExT9MTyVOPhC3eBKoK1DO
                        CvrIYMIxPUtuuCUg1DJFKEtnXKr8swJiMDFb6+mJSby31m1923dAkSTFoiQEoO0TIK8JeTh59xM5
                        REhmLLkkXcf/8X7L8KFlZR8yZMgHfPbjDXVoOZUJbYQQrmknxYClWxcdFS7jhWqTvmLYStqjYSOn
                        bHnJQsPH/0CFvGTURUi1awl5aFA/3HSoz0CwnQpD59cW7vXu78b0lwFoeFIrhTOxS7O+Hu1Svc93
                        dv30JKTCS01JQJLE1ui0VDKuqKkJESgwpPDMZ8MXSXEYObQJqYRQpuYgQWaT6BcTB3/M8//YxhsQ
                        nkhvgwJwEcZNgcdy5e5ETurgmTUUau9MyGDdyxTMDOr6qAL2mbKB1duCopYuGwQXj/7h3HgEtHjo
                        a3uBzipJUQr6AOb3UV2FJewrt3xryGBhxZt4UD/3/T/itgYZV8Yt0OzKtpgL+hMaxFcrBWFcBJSx
                        n21LPZ0HpfviJyPANx/dxFrnGfP36MibW1ePH0Gd6/esV9d2jWfCQbtqIohcJnMT5pCmn0JcA4KK
                        ugJiICt86d4Y57/fIlnj99ilfPn3O9/On9+xhbWYXOevrQVlTEmJEj8dPPP2HawrmQVpaBuFAMPE
                        kx6EuLwYwA40juzkdCHN7EMg7EOAmWvXHy0D7u3C+fPcOovByURoThztWr3Pnf0vnnpWWgf+9euL
                        p/L1fmV42NiDYyRLCMAEnKmvAk0Ts8MQrviM2Y7aSOEUQMFSopIGCSINZUgl9zXdjJ8RGoa4gie0
                        86ZhXXcf5b9o+DhUUPK6fNRVJHS/gKteAnr4p6VxdcPHoEa8aNxABvLwQbGMNcWh62KvpYOXUW9z
                        +u0QkkzE7s24f1c+aizM4F4Ypa8JUScWBxpR7uSCxjRb3fU08PAxNicPbIQe6/zB7ev4P9O7ZiUE
                        EBbKnXG9CxqjKysO1rg+qBdTDq0hZiAnGIicQgSWDRpWRKLONMKZhC9AByd04SYrBT4SMr0BVXzp
                        7gzs1A2PjkyafrXKYoqrxbDwywtcat40e57xioPEiLxfKVyT2pIoDE+/jURLx70wSWXQSWEGIUP2
                        KoqBZGWDh4AK6dOoFh7p4IkKfv1YxIy/TGssmzuDr8b9g/Bpb3b9/hyrFTmDtqHBwNTGBDFRBu0h
                        aXjxzFUxKcrKLfvXqJx7duYlZNHeyo4kwl5VAQHI4HHzQGO+bYnj2Is7SCq7YeQvSao6y3JSrMrR
                        BGn+0lpMgdScNBQhruVOkh+gZIszDHxgXzsW7pUuQnRcOuc3t0VFVFC9JE2hI8KEjIQE5GCHHqzW
                        IUTckoykGMGEUkLQ4jAkZXcTG4yEgjkAS0H0U9XgQcd6E43DQE6OftgIPr1uDygf24few4ru/dj9
                        Or1mF2WByy1PQw1MYe906e4PL+8lkjfJQ0EEhuJlRKGaHKOrh64gTnWl7df4DpKZnwlhUi0qQFlo
                        1owOvnjVx5H128hIyW3UgXUTQn1IAjCfA54yfi/Kkz3DjUP2n/CFjev36DQyvWIc/aFdZK6uhOYW
                        JoD1OcoWiEVcjDu3dw4fQZXGf3Z4jKF5L/DmrXAb0VFGCpr4uFU5uiD0bxZeHhCOncBVsWLcbpPX
                        tx89Qp3D59GlNKS2BJrsKORKgHASCIJ49QOUW4E8tYUGO34UvDSFYKetISxBiSMOQLoEO9WyTJA0
                        9aDhIyfEr0XiSANLkabT4PLeh8XcQlYUe/eZPA9ZWWJsCI0bklECQjAT+eJMJI8+R1aIfqHmbo36
                        o9KhS0US2rgQK+Kmo6dMWlXbu4vL99+Qr17v4I1zSmxjfFMJ9w/Pz+PffbmaUrUNyiDUI01DCzpp
                        KA9YT7ntm/fv4XSizdKCJTRV8Sv93khOiqroZwO2dsI2C+pbr9p+xvBwsTdgdWrEZuLxt4K6rDma
                        ISK0V5DM5K54Dy7NFjFMXGw6ldV4SY2yE/KAxLJ03C3vXrMLK8BGZ6GihLiKeeRnqDjj976CCObt
                        /+Sey9efGCE63T6mpgSYBwlJGBD7FGiIwI4aR7PMnN2BA4u4v4MJGVhgE1sBa5E22KcNQFQvCJiS
                        QpPJYkUEmxROAQiktBl85hRO87SfGpkQRwYTcdeXLwIZEbRr8nksuLJSaLE8rDn0AVSCmZxHUVhe
                        eDSXtUyVNkRGHz/MpKTq8wEXv3xGkcWLkOp7bsxP0zFwj8pHmePMWivCLkEkvOKirEk/v3uHJ9NG
                        5gsaMZehJQgtp0gG/nduioLEQnkQgRva2wY/lqro7/CftbwfLT+3c4sGYVCh3syeeqk0ZRgJdQEV
                        Fdu+EcNTpr/FFlVWgtVEdrcUU46LfD2Oo6NJIYZfbs6RMMLMyBh4kJ1k6cyH330ZhobaSIaOGgeo
                        S0akGMJURfciP2fD586DrB1Li+xBw2BJ4ukuJoKyOJ5hTRaEpJQFlaCkokHIWyfPAJSEKBCAI5EY
                        R0vJDApURMo0NhbzO+PNrJKqInuUwbRU0KoZXgSQI0TFyIRDER4klYJ8kpI5xAEs2TRqZADqU8Pu
                        pFiuivpIIEOVliEjXMHVDF5fXdB83FjAlbJtqn5RQgSbsZanr0xd0zZz/82mSsfm5cu4YOmjoY17
                        8WB9avx571qzBr7EjEWlnCiVg6rY81di5bgZ8oqvq77W8Dy0/v3uPg8qUosbdAiI4aAlWU4C9Sgi
                        v1+MrAUI6CWWXkRsejGTVsJxlVLGoYy1UiU/wfJxE9ocgivGNHlAcF4S1VNqtwxiZTqBcmd+oCT0
                        UVOJKvt6ZG6ishCRspHvl3NlFJiahbgG7EIiYUjhvyZaEtUoCOigpatmiBVm3awLhNW7Tv0h29+l
                        jCrJclunXvhW5dzdC1ixl6de8D2x5WcOhqDufOfRDYw4bcnzn8jNojUK0FwoR6iJDVRCS5m3DSPJ
                        F0/WQCX39FJQxRVEYJfU4jgMYqyZG2UkNat45Y2b8/x5CvKf/zaquR3ccC/hp6SGvVGTuGj8E70j
                        WMMT+WnQlZf3cXDKsfyNXV57aVBH6ggio8hcpI6N4T2xcs4sLwv9P+FrCwwi5sGImMdm2RpqOCFK
                        qsSG1NeCuowEZCBB+D1tizaAVXAdPHTUA7HV10Fqng1pWrxEbvsZnEKLtvw+wFRRklLk4UQgpQZW
                        mNQdb2SGWTlZS0SHQqIkSgjgCBGrxklOAmowgXnjKBRwVWxAK9iMV6qqqjh1EL9Olhjtj4VOQUlq
                        Fu6CiMmzYL0+YtwqxFyzGH8jJv6SrMWbwCC1dvwAJKc5auxmLSWWtWbcGaxeuxeNpizJkwG1OHT8
                        Co8noMTe2HgYFJVK72CCadEixQRKK8EvIp4qkmPTSAwFlGzJKmIEeNKgNPkTSClBURpKpM0Z42rE
                        UysCUW9FDRxPySarwmoDBNdo1028lDh7mys3GfxfNmcO8/NwaoTSRyo6jOQoj9fKljBJPwnV03hH
                        Nbf5f9cLAwAEyqHoQg43bwosqIVOBjYWIkNlaWIoN6QC8xIYW17bBp+i/D2TmJ8eihpcG5Gyd9Qw
                        R27Y5zR49x53p06zZiW7WGCzFGMLkGHzEpeItJk06g84jLw1FMAHtyCbYS8rCUVIAF9XQnbWNEmt
                        ujMjEDQ0srMaC0P2YtIN/+g8coWMMsqBuLeSW1GB6ThLze5kjS1EUagTSXXFsKCWY/MTGK0lhEJY
                        ZA0lRxSgoIoPfhKkICNg+J7bvgKUVDrKwHd+5BYWwKrp6/8OEKTfXJ0kdj7/fOXoBkw5YI5gsRLq
                        cAf2kRd9/KXd0QM/oP/tXxP9J+KFhYJldMnYEY077oS9GDnTwfo2IC0Xj3Nh7duIFCD08Yi1GEwV
                        dAWWTSh381/W9YWQHcWjdHkmVf3Kbexb57/vAhxobHUAQihyAJEpfSAtgRWCwpgulE52lBDWFAyZ
                        Ded1fShH83S+QExmJIcQ12btjOnYOlpSs2cWzH3v9o+3gNlvbv2Inh+YWo8A9Eao8eCNDRgqOQh7
                        4UQTlISCBGII9c0jL9lBWQIicFVwJRVMuW3CDhFRK/WX4h2LZuw6/yyd7vXTL703c7psxEpkknBM
                        qrIliN3JtJS2Qat4WvSBVeqvoIbd8Ti0ZP/tU5fpT9MLAwCt09bzFS+tjAS0UbnsqaGJeQiEZS9w
                        9vXMfQzExYaOuhF4myXgrqcDBojrn1gz4VilEr66ksse+e3bmHCUmZCFTWhq+YDLxJj7DZaY4UfX
                        Sg90YU3hrLK8C0uTH8KYwsSc3DxCHjMWfqQhzYd/RXlcXe/17lvXv7GusWjMf6+WNwaN1cbJ8zBm
                        vHD8KBhTMo0vj20JRdgysHpQsnTmFQdi6iLS3hoK0FO54slYF0DLnHWlU1pFP0FCArDksS28Ht28
                        HFqBmi+1rjwtHjH85GkSS55Mm1Az7lf+/SRcjt1hNx6rpIatUGZ/bs5urrxd17mJuUATtZZZjzVR
                        DYpTdWTZvH5eNH2g8BC8vw8SVrUGBqQ/TYBm7SsliQmI6XDx7iwZWbGF3cH30NycWQUF23YC43lm
                        JHUUIE9apFVVUc0D63B5evYEJkAmKU9BAgJYI/RSnuMnz4kZi1pd7ZknppFwNdeLs5I7+wEMNHjM
                        Gli5c5H89uJfxRJT29dgOn587D4QmjsWPEAKxryMPcYl/ML/fDogo/zMt0xIxYS0wPt8TC3DCsGp
                        CNPVMbcHLpLDy5fvXDWX7fWJmY/rpB+RpbUIEylwCEa7VErFADOSS8C0Sy8JeUgCtPDB6kX2wopA
                        9t3Rqndu/mhPyqidMwa8ToX4nWUfHxiNfSQmZLY1w6eOBTORmQXhILT8vIIxdvAjs1I7i36o61s5
                        dw9fGj7IeA5d3rNygzs0K6qiFy1Q2wMDwCr+7dx70L11CfWYE+hh3hR9HG1hUruQpkM8tcNVXgRN
                        GDh7IyRmfnUeVMxApK02sGoMLFAwlK2ogmPRIqIYALhbJWPDnSIwK4NzdBhKMjinNzcPPmDbym6O
                        kNRQ3f0otunT+NvfNmYnlOKuZ5OWC5vx02JbtjZ7k/ttf6YkWpHaandsLKPHPsLnPBpnRrrIrtg5
                        Wx5lSm3pjhZ441Bak4v3IJnl66+OGsv28MNGzg7OHNO5ieXY1BLoHINTRGvIIQoRTuu1HE5EyhvZ
                        24GJyFBCIXFwyKT0JSd3MsH9I01YKBYef0OYg2aIHSHma4duwo10GZPX38CFtXLcftixfwjOq80j
                        8EVrLq6EvJv4MZti9fw9X5j7C/DBZ2h3XN0AZkKSuhH/X6Ki1tHOxfhn9RBtkQ/5xJMxHtHYwtq9
                        ZwvYT1mhkVFXAjoRfVygQVXp5w1tVFQMs28NIx4ELBUBKycQSQeBKyoRKysKVwuy+5NvdO3VCclI
                        Z7d+6gsbFpOPyPjB3z5NJlnN2wFrOTQzDKuh1mOXbAujAr7Mv1w4nBMTg0JhKra52wuNwKM3O6Yk
                        F+d+ys98Cx4ZE43hCNA5X+2JJhixWB3bDc0xTLfa2wKDEEVw/u+XCVPzaWj9eNL/CU3OvM4jIkkq
                        bx0taBo5wIjuSenMWl4SQpRWG/HLxEQtSHhOLN8xfc/04uWY40447IN7XA9RMnPwHlPrn4mn5F8D
                        LribULFnDH3r9+HcGGreAgJY/eVIfJFD2+ePaMO/6v2l8CC2v8/YsXIk9HDZUiHvpLSqKSQsVhDn
                        1weV+TP3354iXu3r7DjRm8efkSSxuGIkhJDbkWFrh14Tye3LmNJCcHOKtpwZVPoSWlaJ48oiWkEU
                        HaJJR0Smirrkj1CEZD/4FUQfe/CSTM2HE3Tp3GzMQkDO3VGWO7G2KulSE2hXTDiTJ/PNyxGHdPbM
                        aKQZ6YWWGF9SP9sW6IF0antsGE9M5YUxuAA6NTcWhoLA7XBGBvqiW2+LbHMjtjDOuojtmx3rhx+i
                        guE2P9mTw9f/IENy9fxtDsQoS0M4WtHLlXEvDO0mxitwx8ySWV9+mJEyuX48q6taggNq3vZY3rxw
                        gonzHoq1cvMWXUKHSnDjprbNOkc1bnQ3wCiK14cJUTUoSkifWzZv+Qm4/fDRY26HZs/UaUdO1CjC
                        KLoXIyqKfIpFaWh3iBDGocbXB5//5Pt9TZkPTmefPhTgK31MEF16kRWcU9uH4NsX17wU2ggAh5DU
                        QJVBEiJaAwWYgIDU2kdTVDQ0IOlkyaiwf3v/25G0b/l06dQrWnN/Jbt0RDGwPMNTfBzoheOF7shv
                        Mj4nF27RTsXDmZNIUlVowMxt7paVg/PAzjs3qgIbodagI7YGqmGy7vIprfOg0nqr2xPaIzltjpYW
                        IPTUx2N8WweG/E+zvj5PFjf1pQPr73gATsMIT3toODlhG5WSEcCCyBcnzE8CWRLsfDKMp7tZ4B7h
                        z+RbQ/uncPd5hGI+Z+QQy7b9t23KFokxkDy7DAQHLxctxdbieeEFHtumDPyrV/edDuu8HCHmOos/
                        dAGrmMwZTGSFGYTGHtCBKjmWKSiCJ6rbJ14vwoM+Z+NpGoHByfjItHmgrOgFLi4QwboRzcxKUQKy
                        LRK1SDN0UMwYbNkefohoXDxuD6mQt4dPfbgcIa7cyJY0hxtkeEoR5KTJphQncTLHftgqOFHjg3Mg
                        r7R8ZhdIo1stybY/7wFDy4ehh3z+zC+hEJuHJ4AxZXBSHLUh+5di1xctcaNN45jzubJ2FfniWW+x
                        hjpl0zjLBtTdFfS/RuroFgT3ecogjozwLmIQHm2P7DGFRUDlsKAiwp2vMVCBAtw0OqlDR1RAGGGb
                        fCKwLDOxKxD69cxfDUDJTaOOHM+k34+TMAsA5yldwUeyjOhiJFZ+pwTpLELvJaSLNwwsGtO0m/fP
                        9Y03eBhbHKvqUrkE3Ku0qkjgkCdYwX42MSCdLRkgooFZNFsqQc/GUUsJuOe/H0KYd4xi6NBB4GlE
                        e3bqLYzoqiG4oESNy5EysFSsnCR6iCgOatMCy3EPs3b8PTh48/XPXbjI2nnDxxAk49u8JJTx0Zzf
                        VR39YIk8wMsSG8B64uG4HLq2qxdIAHKoklqqK7Y/vioXj35iVV9s84OLcMb18+wcaRaRgYaIp0cl
                        v9Y01x/9Z5vH/xGJcX12FjQjfMcjFBUTtFyqsC7Ey0YNO5I+x7W+PEdz7vzJ6AHFJeDVfjNtxtij
                        BKGcQ0OQSYcnlFrHF1x7qgYBSatEQQfQ4QKqCiV18cXUb1+/gxd0PyGrF1eKv2MFNRglfbVphTW4
                        8cdgNXXhfuikbI94rE9YtXPlzxz9ufBgtr9P2r1iKlZTtkKKhioII6RkiICCxCSiJM4mmiSlyITE
                        kRYinu96JU4OyOc4cOcf9lQHlMGqbS3Q12bIKzIkU4UuJwJ8C4UXjsqWuABgLKw7u/vvv6LcZ69f
                        GTJ9C7tym6aCoiuJk2atuboKGlJmZa6mFHuhnePX+Eexe3YkJRT1REtsOYfAesHJtOFb2T65mHFp
                        bj2r4FmFHkginpTujn1Rpp3rq4fvkYd42X969heXxnTHZuhn4dVRBqogxrfSW0I4HfXFEDZu3JzR
                        39tbb4Vnv04CGGE2C8mrXmhvDjiKVTSbeVEksXyQmIaSQQT9FTGKVAnjTcpKQQpKmJUksrDHByRW
                        zL9nAnRh5dXYm182ZzeTi1fRdyeznATVoLAbpdsHPZeq4dvsf+NFguHDyCfEtbRKiqoFBHAwP1dD
                        CYBGuDtDKGSqhgqLQaSsTlkEVgCaNXdykRLBVUEOfkiMO7tuMe0Wmlrx/syJ+6SkvBjcJGVwKLEx
                        XeQ18X9VnZuHPz1if//K3Gjj92+hQ6mZtBW00Eh1b6iDPWQ42JAca218NMa11sSunKgeXmqfVE5e
                        1RGtQGIzPssG/1ZA4oLJ3f0xRVrBtfgPFpzshxNkaWnxFuXj3JXefl/etYldwD09xaoryrJkJbqs
                        BCWwHtFeXRUlkDWgI1mHY2x/Hjp/50GZg9ffQEI4rKEEAuKYDce6K0AHnkToopSsqhOkqTlSI9I4
                        5AGepgMmyylyTspHhwkVdBcJsOWDJ2/IczNXUeloeDK9cjsV1vOEprI7OXB07u2M+V9c/anwILu/
                        DGGXMQqKKKCBUhJnhY4/6MsThVW4XBpmYoEmqgXKCFMllVZFHoFiWtCB8SrKkWNohztIdFC0NY6m
                        jBgj06QRTLHr4K4Muit4QEAju1w6DCHDxvfIYbdx/gHlXan7GL167DLiAQ8pqqaNtCF9aGmvAj0F
                        Qb6WFkaz3MsDbEwWI7ciVP8PjSPszIsUWVdyeMjnfB/MoE3Dy6/cOZmsq5YWo1phWGoTbcCkNSLH
                        D/5nnut1f3b2BVbE+MsjRCQXt1RLSn8NdEB910tdBaQwfGGgZQU9CEk1cQzpAI/R7AsEdhZ9U2cJ
                        PT/aTkkCZQRLq0NOLJVSdIiyGCLwZvnhgcCTj2crLwJjYu8PDE1sWLP5yhqQxr5s35NMayesZseC
                        gbIkinHUoCo3CaXPWftT8FlkOrNyOxdRduimGRiTZOr1rMZYqlf1HUM93LF5mqesiWU0U2VViQjC
                        LiTTqQQD3LhcjVYcHoLiUJF5GIe7jcj3qEK3t8g1hqUF423rxumoj9Mf0Z27prNwR6upDXVkVzXV
                        X00lZBiJ42CnR0MaK1ESb21seeTGu8f940V/bG8X1o8OmF0VGuFO38cj+Gve5dOgozquNQFWKLLP
                        uOJITt8eT2Ze53BpY10X0wyrw50k1U4W2sAfNmmuhIYGlB0ZuBijZ0VHQgr6wJl+BIXLjWFKX8GW
                        N5ePfmLTeh3ZGJfQJLAoXBsRJiSJSTRIQsaTwCixWBxUFDDevnzOH+83kZ+qWnoQOx/isKLJgd2b
                        oVMW27cHflYzqZYsea1dz3f8b+FFjmN4yCD2U+TkSUqMrH6D4dcXPzWu43lkHmCw8MG4bhVraIUd
                        JAhL4xbpw7z/3GRhiTe3ZHXwmiT9IqISJ5eFAEZU8VUegfzE1m+ljYP2s79x1A2559IKuuCmUDTW
                        iqiNBJWZ56nA6StPRR28oEY7vpY2NQN9wfl43H8/pjVaY3auw64+DyhXj59DGmV+dj+eSRXB6q4t
                        2Q59sDJQHWyLbvhOGRFnh84yJ+fnQHV4fnUDTUE4O6GCK+mSrsjdRhrC5CCwKLHukHXRVN6KvrQl
                        lVC4btOmH91l8Y688Yy8fbV69RF50CB2JnJ4oWk9XUEM2XRoScNJykJZDRtzcuHDrwxXpjLsjTwh
                        yhjrZceM2O2bt8BQKU1eFKAjnTyQHnDjZNA/lW+2aw7Fm5EUldLBAoJ09hnTTyBDzUUSWN6tYBGy
                        tKcX83CUTKEGMYFv/PLirG5LQMTqk/u30b41OSKZMC2EmKcQX1EAngR72+yDMAUwaN5O7rfI9dvH
                        oTPuHxkNPUhYg0j4qeJvS01dGRepylqjoSWrRDPxOKrtrpYoNnN1wp8ML1qjDMDzLHINeeWFFXiL
                        0LJ2HHwsmUh6YJWZvGlWHpwFQsGZCJ/oHWmJrqRqHzFQpfL2Jvsgdm23RGZUs9xDTTgkObZtBQlI
                        WiohD6BvrQVFYlwGhAT0cfqtp68A2LxvnL33Y/6bfG8sJWgRgYnwFXNV34iVRI3MoRs5AWpJRPrv
                        3muabZda/puFEUfk+ubXqmidmg/Fz0ovoYUV6Al88bcWHvHuR27AAfYnZfHR0s+/Cw3LfaN4Hlzs
                        VrSHfygxOp/QDKZAq5oWpZYhbSHsNIqQ9gj4Ba2ePEkiWfUM4ecWA9gwmpU9u2IVpXH64kxpxkJO
                        CkIAcnLXXkeHli+pAxVJDvZ5WFy9fAsH1XiLR1oURgUdRQhrqKAporKKCHmgb8m7VDIkUI9a10Ma
                        2rLnYH98KZIj9szPLGpFhXHFgxB+8prz+9f0t5+Beu7F6L969f0nevCETjMCUvCLfOHkHj9TM4Na
                        k/lnqZY4xpW1S2a8U9CNZOXRl6uhqQp1c1LQ3oqqlDnzSdDrlWVVVVNKOocc6CJR9y++eN1QsDQk
                        1sOlyV9RAu0ECkrBLcSPM5k9s9sHULd9yLJ88Q36UvfJt3wLIp05uA9vo1+kWFUzhugBFZKRgSFo
                        QobU0ECAQIUFJGrgO54FNNWuxb7JvAMmfoWDjpGcOB6QwZGSST7qiRksE4KQGm8JUwgqeCStIp1R
                        27YtuMGbh57Min0PHulSuUyXD4ywjgTf+xI6D1VSEtQzQ4bcRIvPhw/+N77OadewiLS4M8uRpFcg
                        EqWmpQVVeCNoGlmZIiOhKIu4nUEGJgjH4kdEe00cF82zbYluyMtflBmJ4dhLVT6vH0QdOzz//618
                        9Y2z8Jtw9uwp1j27FhVClm9gvHniXjsH/OQCxLc8XwPm1QTCF5jnELuGlpoxmFzLqGelDS1YSShg
                        p0CSAmxGp65AaVRHyoEXii4pJw7eZt7hrfY6x+nj99hmK/CPjL68JHUp4iGzn0JnFbFBbK3Tpg9X
                        3xyHH4a7WEv3EHnNy0hfvfuOJCWCmI4KgkhJ8mRUyUxxDKM3tENkC3BaYNbFpu5Fvsd8HCLnbvxi
                        0k2LvCWV0bfkpKCJeVJbBIoZQafgiBZRSFxiOlFFArrYRsWWUkaeujv4cbjm5cj2tHj2BydiYiqd
                        FCJeXgTcmSMunYph2mjBqNZ0//2upHs+YvQ4u23aCgqgl1aiBNdUW0bq4LF4ueCCZfbdexI5rxBX
                        DUMUKCrhHyiXlqujTDMJeuqHLrSXrAg6KOLGxZOAYvHt0lFvwZOxpycWxcEVZVRGNOUQzGZgajOs
                        ICVaGmqPHqgn49jJHaXAchWlpwIrY00dYmkKhBRYfyQGDVU6IQWkUeBop8GJPQtujTA/GJKdi+e/
                        +HXH+/Pbh9B4XO/nBkYJERwpLHg5W8CMNT07j1Zt6TKB7kHkgiVhH9uvXFtllzkNy7F2wIVBYykk
                        g17YzNUydj0+TJCFJi2kUTSY5+uE2u/Fva4Q/BMnFAA1VKM4pgFOBPsX6YHA+R0lJIJbBU8AQYSJ
                        lukGTuSA2lsioob9YKB1avwWxC9AAnWyRQRBIhI4toaXl4SivAVtsI9f0q8ehh0xop32tPnj5HQl
                        o+NHWbQ520iS4xSs/2Jhg6oAJ7tm3GoOJshDjZwVBBHj1JOwQYtEaolgES2zaHP0Vy3u0MURXtj2
                        WjqrBydCmOrJqKx9fO4/i0WhwcX4wJyW6YlheNmWWpSPPqDrcuyvDuqIqwDloIMdbm1lXpra4JI2
                        I0RRVlKKoqQ4fC9ubUg7voKMO+ayuMHzEIq1YsQU3/SsxftARPnz3/kPvvtwXDx8NVwwg2PDnY86
                        RJA4ojSt8Au2fP5lz+jSPHEEEgYBPJA+QUYS8pBUc+H+akM6v9fUioX8eD69cR37oTrNjKEDptSe
                        vU/TWwsD8/ffwU8dau8FTXgY+iAmaXl2JSWgJyOrdGgoYqciiiqaZopp4YY6icCioEylgfGMZFRY
                        dnzkZRWxNEkJiNl+QhnljHR0EXQb3tsW3jjg9X+X6bvWg1WnfqDQ0NXdIJqjDWVMKAfrl4+ughF4
                        IPLkpHqJsNuQMBWpM+stBvAVsSnXZGWuhtpIah5YXYuXw+Nk4aiJ3zR+P+pZO4fWo/to8vwJqGeE
                        zK9cCC6lRc2L8VkwbnwbWPDmw7EwjaKsNcW4A+akroQtGJjrIKNDU0oKwoj3ZGurDv2BIxjn0wIC
                        sSe7euxp6dm5GSEIHw8HDMXbDsQ+6/3+7fvIPi8GiYC4VwYM9g8yQQIhRgfFwcnty8gQcXLyJeQx
                        /hJA98qV3cJGQozJYjZuEhxdoK10kQMy25ZPR4mMqqobeiAcJ7u5IrfvyHgPkqWJgPnDx4PKzlNe
                        BFIja+mS6ePbiPV08e4tTWddg6YzLmZmZgoFFzVJNrqZFTQLmmDhp37uYuemr6LAxs0xJZsjLIJF
                        cQL6Swr1V3jKwcjNu3/vpK1TX1I6GlZwItco/61LN7Guthz9YNXL5vXbmA8qRQBLlYkH6RI7EpRH
                        NVBXTSVYF5Bz001OTjyeMHaHxwG0vqyQ3NGkoRHBvj+RfO7FuFs/tXEuMkYdmQdKrYFzi2fx0KUy
                        0wpDYJIwYVwMG0OdpSBNSWRKw+aRJdDU10NG6OYCdr1CSGYWp5BqYPzEVNbgTCfKxg1qUljJsZoq
                        6+aSmQv2prly+DBwlsR4EURads3EUG8WrKqOxrhhFe7vARiBAoVISXlCw8pGXhQsmVpEC0eR9uQU
                        Zm7NZCH4OW6MpXg7mSEbFL7Sed+TX7XbAURyfBgY22SoshXEMJl48c4R5F/ThU/Pb5c+wbOwZLMz
                        JQ2bolRpNWYUBhd0IXJiajhFxAObmuLFLu8eqkyJNySYz9+UGq39q79+8Rn5YDVWIVbWosLbqGR6
                        8OOHf0AF48e4xR/eKRFeoLXwdbGJD619Wg6EhTCt42LTBn6gA8vHsNb1+/wKWDOzEl3RMz8lxwas
                        0o/PSOoiKW3r/GwrHJmFEZhPs3LmDXmikYWuyIKxcO4i1FSYtnj0Xv1gbQkeXBmEJQ07btkBYWiF
                        ElWZhfm4/Vw4oxpiAcUU5d6Dh1NFMXwoAiperqAR9K8Nfs7t07GFyYB18DLQQIeYiWk0EoMYyvrD
                        gCiUndZKTgQR00WEUT0YbGqA4OwdSa/tixbCnVT9MDfGzt4DgPP3SSEqKPUB2xTj7fBxbW4Czs8u
                        7WlUSQBEKVxOBOlBdrZIzpERm4f+oiN0/lI22xIeWVoxu4CcXsu+Mjh2Fgs2boTzqnQlYeqUIV5H
                        Yzx4kd3z6z7Pds2qIVMO7YmSIfTWIOFU5MRrmZ4dyxnbh9/QLivXvBuYcZPKw8YGzQFop8Sbj1Uc
                        XGBaV4/+4VLh/dhBERvTDQpQOmxPbF4jJHLKt1x96JqdgzMxNb56VhZoMPppV5YkhsHwyLM8XEfC
                        vcvHiQu/67N28wfcwQdCS342ppgbrCQkwfVIlFQ0oxvzoF28b2w+S8YIT2NIJtKw1YdTBBK319xE
                        TH46cfNCf26tlzFB35w4NcUDABJVJI7kieOrUqH0EKQsQZNsfwqASsGjqSm/bKjOvIP//EgYJNhp
                        ozZiwJZEX0Ie1p3bItXrOhjg9t+iX7IljYANnoikHcYxs+KuIIVRZDgCr5P4ECnCQ1EKtvhgnRmb
                        hxtGleyucXYO+nhASjn6IShdMK6CdQQZZhK4yITcOtC99/e/xzqxk+BlrNDaGiStEH6YZWmgpIDb
                        TBgtFZGF7ihRCHdghxdIWfQwBaGrWHqqwUatN7UwU13U44v2cpxkezh9M7YU6mDXZNCMeG0cE4tr
                        AKx1fUYfeKciydEIV5AwJQHdgBQ6I7Yc2QIDy7c/ZTeV+9fIGKgnSMHTQAA/KyEOdmi8GpodgzfR
                        BOzW/A/KIQ1ASZox/lK83PCe4WfdGqeVv0Kx/4oRR/3Y7v2otgciXBFKFG8AkssmIIU+ZjpKcLjk
                        +a8skDfMwzW69mSlkRDm9vWvaVjZqHkPvsKiaGlnw51FfV/e7g6BfB8v7dexS4xZIL0iRRKkviVg
                        x9yRVZCQSwlCaaE6hzy0dEtTTAuAhfHF86j/sfy8CWinpkquiT61FCDl8BSQSW0t7WuHbiJPf7j7
                        D0onKo6utAicSlurwCgUWRwGLLgWVmQzRKEpwQ7e6KCHc/KPN56NtODVOKrPCewHL1wHxsHeWHVX
                        X+GJNqjQFxXTCu3AJ71jQ9nPUxHdkwHMuGxlBYaoUZpS5YPSoCD26cxMvGJ1gxZzjmTR6MwaR9gj
                        wc0MFIG2bN9TAoJRJvXr3EozMHsKAoABNTHTApzw9VCd6I8/dAt45mSE4r/lCKv27XzlxClrkHPM
                        SFiJBiiwGQhlFWwpGpE39V11e3bsNod29uWMNTioe8Pn1w7fBB7lHh/s6OsCawdZIVINozAO9+Zz
                        bdF8HCbmL5GXSHlTiPxJEMXInmg9s0R5GnG+YVl2BBTiEGunsiiUJVHxKPsS2MMCEkAvsqhmBINx
                        vEUKicRNQWIcFHhIoWhkXFU7j217XKR/MMDYeQjZiqa0CPUjMVCuutumBybSJWTcnHyJJwxLrbEM
                        NYQ1tODL7meqRRXuLajimYW2iGh9dPc73uwa0LmDMiBuPqvTFtZBjWzK7Cxjl1WDImH6vGZ1Jlvs
                        CFfauxgsTug5tncf/2FcwdW47BZYmID3WCde92MNCUh7G2KizbGCPb2xmvXjzHw9P7sLDQF5NSbC
                        mq8kJxmD38bfrArHNvuLmHfSjFXzcGiLP7DiNY1YQ0ixq3coQXdegxcdFYPWIECe0KFLv7IF7XBG
                        kiLZQq6yOTJEESBQWjAgKxpF8x4lsao7e4OBw0dGDfqjNmT1/IPa/0JfsPsDBWWTh+Gix4CrAhN2
                        QvJcHNaGNLiLMn9bmH1imx92zm241z5xCqa4hYZR1UabREiUgHmbJ8hEpIwJH+n9itJy4ePf4rpP
                        9Vs3R1g4BCVw2KvvSpkHpsHZd2zVCd5oczB9fh6cN7qEuPQHddEbroiaMuxRqX147EweHhmJHSA2
                        tGZuH547tcnh7eu4q5U/IwZ3IBpo3Ix8JxlQSUyqaZc/Q7G9U9vH0Zlk4mTTKpEv2zA5Ab74HYIE
                        cYaclDV1UePdu3hk/fHoi06o4Xjc9w58QujEuwQ66tEZKtWsC/ZwvKnzFM23dGRwr3t+1pejT3R9
                        jdazeQaekKR0khtyZNMEkFXxU1BOgZwVFZDX6KOkhWMEShwAD9ZLSRLaGKZGk1ZGi1RFEHU8QYNU
                        MfckO2coroKdJARWYJ6dUvP1j3H2BhS3GVRqfASV4e7kThmabd8eRuU8V+yVgPvXX+AtJ0TFAp0k
                        OJuIDcjwwCJMVhTf+vCI/C4x+8qZO5kyvkNdWgpqkNLVUt6CqqoFer5iiI8aSIqOmG5oPbN2DfVh
                        V27XlYMTwKe0dEYGWeDSbH98LkbA/sWDyei5xePn+KRbNrsWn9TGroJ1g6exTHQuwc965cxIldmz
                        F3VAUB0QM5ERaozPDGrNFlGFCUQlGOArRFcmhOwPXu0wVDsyKxbcEELGvIQ5lXV4R10YB7WzXYt9
                        Gj/DVDC20dGJJ+Gzl5/g8DyxMKgfvHJsOGL0IINXi0QAlekrIUkAhhJylHbaiCQAJHpnILlOt1RF
                        2rXpho6YUDo6fhFUVEj27eRKWNDVxINtjL6yDXP5b02C9Lg3xu/wEWdq8mwsoR9hSOhmprcxsTsI
                        LdvHQZa+bO5dZ03Th5Eg7OmYvnN5ruqfzElHV4DMoE2qiWVkSGhBT8JSXh19wEx/fs/e5pfF8zMz
                        sHbpKTCoFFW1Oferc2LDp1Rl50AFbOGIFnD5pm2t24ch5Z/q0wqcQOO0aGYG2VO4aFdUZteG/MGp
                        iO+7ea7qncvX0Z+3cu494vmjsMl88cxNnDu7B04iDU50aiX4wDCiL6oo5AdmDbEty8eh758cHQ4k
                        vDQMhHoK05bly9TOB7gq3zx6E23gWRFq1g21wF3bUV0ElbDe30dKBNor9585YYMGzSDwMLWxnq1L
                        4DiGrbERGkD6Mkyf1LyZOO4cFGWhb+zYyR0tMcI6PicGbLNjy/ex+vHj7CTx/Yg3mJMUGBxEw8OP
                        PUEdndjjrNl0ea/wMsLP52aNEWzmxloeYtPhVqfN1gOBC1easoI05ZESXaeliVmoVG0iJsrZVdtQ
                        NQIq+JSkkF5EjJEZrlkGXvjsf3H3D//5HWx8kJCrrqUNTQJFdEYFE3gI2pOdJCAzG4IAmn92/ljm
                        Ost3BIGKpjW2HVEC+sHuSLASEdUERR0NT+iaRZmiY0vSWXs2nZWFy6cBgTxxVixrB8DMkLR3mKF7
                        LDLFGZYItRRV6YOzwFh7bMx9E9G1EU5wv3nh0ISMG4fe0qV0+P7twggA1ERoA1+rbWRksVAZqTnj
                        JSVYEeuQZdNQ2YmLT9oWBh9pQav9wrEMHEInHSCoiRlIcPAaWYGOPU3j24c+0a9/A9Awazn9+/w3
                        2KjM7s2oFNc2cjoU0bOInJwFNaA36GnXFo0y469j87+K/Awh4T2L52I3opacJNXoTQZs0/Fao8KR
                        Nm5BN9SEClKYqQLxChTt8Yp2bP5cCycUAFSuh/lcQsOaR34jUNMTS1gLtb+qPNkiIdoY4qiVwNqB
                        JYtDWM0LNjT3hZ2yLB1xV7NqxsarybF7FvfiEaMrtjXr0b5tZ5oiSoPVKdW6N/kjv2rF9I0csLLs
                        0emoXp43IwuCoMxdH2KIt2wLDiINTneWB4vjMmlXthzpBEzByei5EVCZg9ogKXzhwngPxyE27t7P
                        HICXOHj40Z2hhoQk1BAB11dehr6ZC71IQmuUx9g1YorBz2Q8HCxrkOrd+CGJ02CJNSRDC5n0AlJV
                        w9cvhT+PyeorSnV6/g9onjODh7Jia4OCK/fSt4airDlY51FyMWktGggMUEDUlFxJL/yS6/Agvbai
                        XRLQCmFMk4y8kgxFD/U6GmDhgCZzV9+JKYTFZTRDaFaANatsOJOfMps++woiQXZUrqqOYpIpGYJa
                        9zTxzauI0D4I82c1cX8KmQSjo6UKNwUEPDACbUCO0MmsOsdQuMIeDeu34ZO2bVYdOkDMyt98OCkc
                        GYVOOFvMDOCOljgCiHjhiYE4r9GxbjyomDGE8R1MACL/RLskaGZxcMSycmqY/H2BJvDM20wJD0vh
                        iW70XMFYZpw0px4/wxvHpyD28aH3J19OzBPdI1sbBo3xKWPXqgVatWUNJQh7KWNtS0dCmP+lBW1C
                        ImNEZ0Sgm5vB8HFmZsNcx8Mxd4SyjCmycHL2URzh3ej3vXrnBPfm4aMQwTqZMN7tQRZWqqyCddma
                        4sj3IXW2yZNw/hyrrwlVKBl1AP2fZ+ePrgP2/0/goszGWEmVmjJ4XL7kIpBFPvfXrvHlcZdy9exe
                        jUHKSb9UBGt3YoNeuORdm5eEDi9qd3bzEvPhL9FVTQnydCJE+GKNCeK8DfYb2cHSEgHaBuYEDMog
                        MNdV3oqJImkFeCEVWAbUcT1CSHYPnIYhK3Kbh4aBUunVhPUV4OymLsEWrRBnGuvTCY9MiksmQMTw
                        tCbawj0rzbozrBEiOS3TE5JxBDku3RL7gj+kd2wuDk3iiPNkd+mA1WzRqJp3evYs/UQhyaXYHnj+
                        5hYJIf+hoxbaIFc7M+aNu5G5QNmkGgqQs5YhVldT1oqBlCU8MYYfEFPxwsrxpfoMo5DL6kO/yEFM
                        lKicFNVxmxXVshTEcD4bJCpPPlUSqnhP4CefQjvVVsoI1dE5uWoq/oYwc/WXV4C3QR08USj0nb/N
                        Z+BZYHd+7Cy7g9LKSl4CMvgQBlPvq7++LF46ZJzo+v38SRDeuxY/kiHFy9HE9v3+a+Z+vYVnVsj3
                        o5BTQoKCOKITbQj1tM+O8wKzc3KGhrQIF6iDrpFm11TWgpq8CQPrfUUEZzBRk4ttfHlMoUXNq/hs
                        sjmwm3Y8VEYodIanQ/NGTHYUxJKgYk+CPHrTfiLUxQ5NcZKxsSMbcgAgODrNHPszMyHAyR5aSH/h
                        Fdke3VjoBmhJp4R6wZno6d5LY2D0vB6EQHOBsL0UoojjakpXp07w5jCpOVDEwg0mlG7tKAxLgh1O
                        lVVd0IoXH5Pxwsb56/xNDgVPiJtBFAYHAQF0NfCTFYSYnDl/RLilAdOTIqyJcQoYSiphySEhnGut
                        g+tWlHlCnRSfAndvGmICW4RRc8vH33w5l/sV+D5fYdeOq1gKW4OPzkpBCkJIQ79dhRMWloJBH1+f
                        0g9srm2z4nwEz1cEMGXxajhCqokJJFpKYGhZHZn1bE/tFm5ewKNR1tKKkocXNIdNWVYailgmYa8j
                        BUkIV917aYUNuPBNxaihbYYoakxRYOxfS6BNIeKZhakYtxhckoDXdBupsZ8jx6IdetI+ZWBWHNsH
                        jMLAjG6Hg3lHh0REIvNSSZq6AqoB0d1xJRfbVQFd4Lc8tDsaYhHSdXTcbuOSMQa90GbalzNVcTwt
                        iQWE5PjyI2HYiIUZTITWpqN4OykgYUVfUILHk/HCxs4tPyIRMQpmsCX1k5+PDZ+r1icBSQcJWVR4
                        AsBSYK2shVa44sHSOkdmyN6jB/rJnetErUkvIqOIpU4cpTgY+WCa6dvfCprT/aJ7CwH25dugI3FV
                        3YU9gVQHG6NyUzcVl0phTbqTumpKTi8a1bXIj5/OpV7M/JwQwLC5QoiFAhw8MYgSqKxEXIbNMVK8
                        bMwN+1AnQPc2vy/VrQ01KHnpoImgo8tNZXgn2PFkgKtMLOdU3jGD//9B5rR+VhSX0iFg+Kx+zaWE
                        wtjUNdrDcSrDogunczDIx3xeLh+Zg5IBpji6yxYUIclg1NwqpRBZhfHoKxCRYYGtoFc/NcsKomGB
                        MybFAR2AkjEpxwdOkvy3Gd3r6MQnd3ckPKUJWTgIaiHDSJ6TTVdaCv2xyG+s0JLCrQNTRBROKPd0
                        PM3r5+jYRuPeFJHddPjoc+xC4WAllEdDFFlX8kFhbVYvPg8Vg3agwuHP1lZj8rw5ElS+BFeXSQVo
                        K3WjOMSC3Es988OvwJLPdv3kaWgyfsZRThTg0eQELVXkwaFuT/egpFMJWSgQUhlm0A5aAkQrSGBj
                        IVlJArJYXBCvIYLMPHUCkRqhV0Ud7b+dOdzr/DLCwcoCxShKKMBJprCOBu0RaJQZaoyvLHvDEFWD
                        ahCBMrwjG/NhG7plVgFTEAA8vU0jBkOHeDXxtdhLbVRr5Nexzb1BQ5MTe1Zkoc5o8OxtZFVdSYP+
                        P05jmYkGiPBq/OmBVng03VwVhb449aEsmeLYSoCrHBoWVNk6M/pvnTRsC6sxaM1aSgJRCDppAHdZ
                        EQQtKBfOpQ7ajT5ZcPwb/o2B9tbAeUNEt7uPFk4cvnow+5oSExEdxSsJ/nkaXfGvsu0twCTtThHW
                        XVENyxN24QeXxun8By68o1xJnSwTIKcBSXgitdzF7AQ3TPTqgJ90dUl45wUtNAdGdTDPYPxVS/cI
                        zo0IubqD1EQFqFMjiYL0KurAIq7Fy42/h/lznZeMBQXRstVBXg0bcDGkoiMb4uHjU5bqhMs8PALN
                        IUs2o5ZjkydwBGp3ugPNQc6c5dSJPpIK5TBwxl68u6WWNCQhDunDrMgWX++DiMGxbJAYVV3pa54z
                        Ak2AGjPW0wmSX/XpgY1QMNoZ0R2kUdXZVlEW7XBVOGVGLLkpmcu2P/O7JjDfpF2iLSrg1C7DrCy6
                        orendqC2tzS6RlFWPCzFVfbLC/amzaQblfDNz5CvBiC0BS6D4hN5NbweJze934jFznVKybOR5LZ0
                        778C1QEhEOe3JFvcizRJta4s7V6x9+abJPYLl27gJ8m7WBM4HFVkwS1hQ65zia4w1diMXxW8ePR7
                        Rxa5zeu5/7zMZWHpw6g4kde6BGRg5DiPoGygqQI6+IWaRX/s4Vny1626Nvt+6I9LSn8DcMy8YVYO
                        XYDAp/PTG6wJmioHhsnVWKLfOHYEy2P5Js2yPJrgMKPftidFwYpsfHYWF8DGaF+WJaYggu72Mh/j
                        vMm5yLmVOLPjXkjoXTMCE+EDPC/bA6MQIrUv0wJcEKY+MplI6xQYZ7T2QGOCDB3wW58aEYO6gaK6
                        aOxobJAykKy8Oy4Tm4eGQH7t++gUlDCLTDR2H+ojXcKgt/B1jYfb0J+TXwUdKGF08Ac2lJuFLEk+
                        vvh7qkNIxOzsHo8EQUmVshQE8DrobaKIoK//BvIC84EFbU8S2khXDTb4kx5bXcs9cfjQPL86eNmF
                        RVz+1+zra+ZSsoxlqZcStBs0JdO3QQI3wCEKOsjXHhcTi+YAnePHrMDfjcOXoM5fLyGCQSoU6OwK
                        KigrklpQSWH7OO2ZestLwaCTGhGF2XhzlDs7B1ch6OzMjDmtpATM22xZxKP0yvDsfgbD+kelnCsp
                        kahb8eWFiejlUVmVhdlIxFqaGYHOWBmTnRuHxwJ94TWKaNrMSk4ZWfGvLoyvnc8RvLMrBrQC621W
                        dgVW0c1gxOxalVs/D65XNKL/DyxXNufsuyBTMxqjQbg5NCMSo7ErMHZGPHgkm4e/Ui1+sbG59j+d
                        pf75P4I42NaU2rGwUvaicfakdbCXHY8iRgS/rFheREsLw6ouXUEE1hdJiIDy95OUQSy17a07SRV6
                        6/L6yUFNCXdE5PkhZJnt64fvkXV8SB5f6NOygLjoe1UJnbAcNCyEe/mCDuBNfPnEaZrx8iVLQRKi
                        lEhEAZqSZtsLx+ELfL6JunTzHZzBQlMjKoU1BEkY4eZpOy/vhA9t9hzwnET+naO9bNwepJxbh38R
                        Aen96CHYOCMCvTCjML3TE8xxslsW7wNu+GngaaGJ2bhLVDyvDg0lmcWr0Qy4rjsbQ8GSuH9MOFw7
                        u5/M4ZP4YYoP4TWE6umYu1tWnYOiQXd0/ux9vnTylEfYq3L57hp7dN00vPHTyIy2ebVrFimoFNW9
                        y2aA7KwrywY+VibisYxlrM2DGv/0b3zM7Plirx1tCDL4HFXVoCjlIUEdGrC7UPm5MbIMlHiLQ0ws
                        hzMBHMNgJN7m2OuSNGwt5AH+YkzHsKpdBJThIJbs7c1sYfjQPLAwJLOYHFhoGFtIqNigKGluZwF5
                        85uB5OBoYkmuQRSClIpMRdIN/JHtdOHMM76lWrg/xRwOOhQiiPYlLUywYN/1vB8tFYz37+5C4XHj
                        +/fQ7bh4RhUbErpuW6oyHZDVm+1jDV0+Tmmly/cA6ND+5xeuTd65dovHcLzx/cxfNHDz7dZX76+D
                        EeP2wakX1y5wr2LajDnXMHcX77IlzYuwp3L53E3cuncO/6eTx73LQo0dMHD9BIwGXvP9rbVy+xdt
                        ZUzB0+GE8eNA1uMddz7NgJXCRt+HcaG94I0DeGL7khTzlpWLHVvRVF8NPRRoi+EcIphenpIozcU4
                        i+FgIIII6kRZ2ok/cQyMFMKI2eIgl0V5BBsrvr18FiK1LhdtWwVVXEiIpCrgJuXrmMUEKeHdGYO0
                        UgLooUJWkoY2pdf7yiXvO2sRFznBxRTC6oUqSMAt0WWDF0HEeJ/4S9fdmIp3ev4NTWWVhMkcpc0i
                        0TstxQH+eCJKdeaEks6dS9858G7/NHdwgwFwhcP+Ha6d1YMDwdhzYtwKPbV/H43g1uOsPv2bnDB1
                        AR7IPFo0fh2vnz2LZxM6KiEjFjwcoPR/w9xsAS2rw9fCjYcJKRgp+eDgnZGTi9bx/OHjjIMeHZAw
                        co7ceZA+y7/TixZw9O0u/JVlbcTrZmbK9sFQFSCSzXL176cOaPbug6uaGgOGIWAguPDyuhHIojfp
                        nRNaGyGnHmfZDQuwcizLog2dECZw42PWH3inrjYGKTShJFg0hY5WkbY/7AMf8IWNgUxhPbl2Pl+H
                        xMrQnBSBK3YwvdMCLTHVkkPr27mcBIKAPnPqbcQ+9/1t68fEy0fgk71kzAzjXT/xAgH+3t61fYsW
                        Q+RsRHYVBkFHK9Se95BKCKBOPNOz/+LvznxsASYdwJPuQF7KSkkd2nF7fl3rfYsOQUWJD27M2XJH
                        ckQKa7B4XPv2GW+9dvozQgBtakR5jAtZCUQlCnLtykJcYu965excndO3F81zYc3b0V54/s53zxv3
                        76GVe27UQdTwWDxUjkyqqjWK8NFgye9I+A5ciOzVg0uhqTByZjSKk/anOcUZlsjcLgPgjoboReek
                        rQkBGHt7P1705E/pK9f/0COxaXY3BeD2xdOQpvXjfdumBzc14Tm37cEIrVz6sPy4WwxQBYvRzcsB
                        LTi7KwrF8/zM0sQJlHCOpSirB13V9/uO6PjANLMwKLjBJc+ELEtGuPU3v34cn9h3hM6QFpmnu371
                        CEdofe36XX23jwIRW4e8JOxB6LlUJfoSyy3Txx+7OxFg4s967fQrFfFCz55GKk+bAUl4KFrAICW3
                        VGI0U9bI+fz30yqzC2n+HlXbsxUK8lhvNUMURMgDpJJVS36IrlQ2f8I2DZvGIZ6nMSUZsZjKpkd5
                        RG2SLToyuierdAtmMvjgU7qqsjJz6Sq8TfM1Y+5qq4VxKvBxYMxNg8O4wocMStyycJHG84gNy/eB
                        Er+w8g8buWm/TF1vZdOHEMid4X2DdrNpbXVlHEVImN1VXYWVWL3VXDsKl6DFYMmY4ta/4ZsEQbdE
                        KAFGlLGSF1fB6ctI0Q1KUP/Dr3hX3zzuhF7N9T2xAWhkYw01BDXzV1mCurwk5ZndvWxp7PI0kiRL
                        azO27+1g3du3YLBT4RMGfURWCxIrD0kZRDLwJApH57jPAOIf99l6ssli7v2YGxXi4o0jNCKU+RwK
                        KAgeLSGMLXwECTHlhcPf4fAcvGZSuQ5u2JQn83FHvZIs/WFEODXDE7JRrT4yKxbVA9BkZEoSY+nh
                        vFZBX5S3rPuSbuORrGFs+f4+CiZdwDcmv6F2BubijqQy2xcEAK1k6owbb5UwkMs7C9ajDW51djV8
                        1w7Bw+FvP712Jp7UDs7D8Qy+PSsS4zFwf71+Fc/QgcKx2MzZk1WJZdj/nVE3Bwe9NOrH+nsbIl6H
                        ZEuJQKsYs8nGTlYSotQE9FErNmNsgLT0BZUgaSfPxhbWKCvvo66EShchtxCSIIedhKycBeSgqOFD
                        rnElhuXPhl2XkOLHev3US+Vzj60MntyA3ZSEijr6Qs+orJwltKFX7SbH9APoJUKD5XF1FEJI1Inj
                        Ty5BRQK1DBSBkFjCba6y8uQpluO6wZOPUfAcuJA8dQl5yFmTlF2FU7CDuLS7E7txC7sguwKCwGq9
                        JycGrMZGyubcCG2sGYkZ2H2aWFWDKoEuOL0jEqNwWrhg7CluGjsaJfFfb0H4y1qVlosOiDYbbmaH
                        A0x5zkCCwtzcPDq1fw7OI1bM+qwtqofKyJLcCqpCKszq/EofqRWB+RhnW+0TiaVoxLZYNwJq8WO2
                        KKMds/A8NDczGz/yScPPjta6F8rzGwpBJYIiVV4M8TwYEvB2slNZSHRuEhuZ6Pxlzm2plTMTAzDd
                        aG+ugpkCfNSmxEr2xZeEeBEAWunrh18Tea5e7Vm8j1COXAwraQs5fhwVqGD2sxGYTLqiFeTh1hJJ
                        aCKAwLoxRHsXs2hcpVFEYPogiIscpACRkMJM3TT781VtRP+EfAwuzE1j2YEJqBdVF5uFs1Bs8HTM
                        CRyBwssvPHjugcHMiuwrny4bhUMgwbgpKxLDACu/OysYs0xerUWCyMCMUczwCs8YvDaqcwTG5ngS
                        E6rbHO0RMrXDwwn3rXPgLfuZqhOF44ENsjCrDANgJzbEKxJ7Yf9qSU4FhGBTa4hGOdtT/uEUjuFz
                        bgWnod9kWWYpJPGoXxFTi0q2lp1L/bPoIlXEKEQDkRvFSofUKDuR32v2SMVZcPHwobdS30JJJwZR
                        OnZOXgIq/wFbAQs+R6haH3B7DYEQ2xHUutxcQJJPKIJ1cTJS2DaGkxxBNYUsQILGISKCKQVErxMV
                        gowFAFRVTQf/Mpxmeu6nON83falSPnMCOhEjOck3AoqgKP+43DxdT+WO5CjOARgb3U+89k1WCfdz
                        p2u8bjUHAyjiQmY1d8ODZF+WKxhx2m9DDFGgcvrO7jieVdnDDLxBSHfcJwMDgEK50csCM0AiczCn
                        E2swpHooqx1iEGq20icDa+HHfzB+NCXD9ssvDDEfc43Euqxv3MQTgVVYZ1fnmYRZ+nD52JQ4fPfc
                        jx32sMLGnGXaljC+BG7F9q1xeND5t2Srt54QJGF+RiYGocpvYvpqClacEfBphZBaVwV9GGnbgk3K
                        Sl4UbtmUed5caF32iWBzfvoiw4AZZCVW6XCmtxMaIvKdgRKIKl5BBFaAuVkUCYDLGKpBjSKeVKSC
                        KfwNKPGKdKTgY1Igq3ZfkIFypg3ZwFlOkfO6P/a8a2u7158ByWJNVhvk82rizZjH8Tq7179hxXhk
                        7AmQFDcSKvBifDi7DNKgJHgzJwIasIB1JisTXeG2vD7DHPoTu2+nvhWEQK9vrHYlKHrlhmZ4nLxQ
                        k4kRWCtQHO2BQUhKMJOTgWmY89Hkk45pOBu8lVuJtahUOe8djW1w9Xg/NwI6oUF2IrsNkvF3ODC3
                        B260FuQO6PHjr/Ecaus3HZevjrm3BLx9oJJDCvIJkLRm6cOYUBVAY/TW34KykhRE0JGb27Y/PCj9
                        M5fkJ2XztyQdLwlhXAXUEZucQsbL+kj8aBhQ33F/nHoBcxiwNfABeeDJz4EvRHtuE1H2Fs82tilA
                        ACUQxjFRkpVCqrYFy7TlhmY4OxbYyRKyOJCmVFxJOyHlPe/6tPtf0dxh6HuLzvFJYXjMQtemXG9Z
                        i37/Dz6zc4WT0YR0OysYPAcsA7BeczinG+XzZOlkZja7Ij5np0wr4kf1zIz8VWYpFZDn0xw6kLTp
                        cG4nL/MKwLtsRyV3vsDY7GIb8k7HeOwbWgXNyJLMQp7yTstA7EYedoXKTvTgXmY6c/uUF6PyurHt
                        dP/5jnu7/F2PDAlLFT4ailBxvqxJ76Snh0+wZXF/tXrURCy9aIEKkiia+EFBKz8do6GJAc/+HfQJ
                        1vKHzZSL1QEQ5EGsn2zv85KPfozn3UxmXDXlkbTnSQu1AOznIScOYRQPgyRGkS3MaQgZQYWHJI0w
                        ylCx8bNwFvyRfePX4UJVrKqFBSQIa6NkZkFuCv7kDxZ431jGunLmHX0s24fPw0Lhw4hOsHD+PB0a
                        PYm1+K/T4J2GcfgT2uMTgWk4YzBWk4XR6F7en2WBLUBefGVuDtvbs4U56FeYEkbi01cKTcEbeHhW
                        FbhAVW2PfGdlcv7LD1xbZenjjrHIXTzpHYZxtEYPHHUddY7HWKxWanBCx0T8Gs5Gqc2XPsH9NuzF
                        gHbagbCmsNbfQmCWGtwuMGLpkdXLUK6cbtSFKoIUtSCYUyysjQ0Ef/uGjud2aVrr7cei5elJzkFZ
                        Ht5Ysbv72RyCr6wPotCG/ThdMsLuSCPISSFKeLUSQkyQElQEIcIZLiiCV2yaDwqq5Fa2yvrsHDY0
                        dxbuVS9NNVRSlfllArQrVfJHeX9Z825voanzTi5vlLmJBdiAkxCdiSX4xdcWnY7xGOrb1dsdrMEd
                        t8ArA/ORR7s7ywLt4cC4M64MzMgeTSfsatcQVYnmSOIY6K2JbTDWcrnXAwzhob7c2w3swcG7tYYU
                        N7S+wydcSO7g7Ya+GJrb3csdHMCyt6+WK2eRCmeKVhdsUY3L/9Y5/E/CNjD7VnJ2bBVlUbVhJSMC
                        c3tHcl2/ruPTc0sHXMJAzoaI5K7TYoUTZEWbtuWDV2FMc8N46fRGKbbvDjy1PILYfoVm2wiwD2ea
                        fnwMLs3rXryDK340ZwXcjlBBFgAgkcgZKS8CaweEuLI4B0SwSBJo1Olq+mh8r2XTHc0gqDunZAnl
                        AWtdJCZEuKkNfH9W+d/PRHxpbBmplahJHWnlhi74sdzgQOO09s7G6OxZ27YaObA46lh+BEURDWxZ
                        ljlncrHBmaite3zuHNrfPYXuWESYHq2JlvigvlzriQ7Iq9dubY0KYzNrToik0te2Jd+15Y3aYn9h
                        BgNra3xsI2VljcxxczHaMwK7ECJ3ceocb751wxs7dv3iKBolp3eR24S8rCmtow2cIUZ/fv4Qjh7f
                        MXuHPyDG4cPIorew/g+tFjePm4aXmwAf6h8FPSQahAlcAiQJ55X26H+s+nxn4Cy5M79zDALwLO5K
                        9cCBwRUpIUAUmTsJWFG4lZewKOo5Q4/CgGT1FQR4FRG1R0641ZCSnYNmYMhrPdKGRUUSmpivR25m
                        D7Av63jKn7a9v3Y451COa2tcW6jrbYYWqFdZ26YmmX9ljn0BtH4r1wriAEW+NsMc+nHY5X+eHW3E
                        K8fXwVJyf4Y0KgCtYm0PdpNjjiQ0zSowe2tOiEjfodsb5FN6xoZ4plrbpjW1tLbO3ogBVmFEl5JW
                        B5SiVOb9zDTaD+p41NkYjp6wIPaocgaTbAJkkhsSKKQ3xx5uABboT6t8aAcuX0afjot4C/ghaCZJ
                        t29q/x9sXBjZvw5rNO/wksbM7sxunz4abdjJspx9b6iFOUh5ecAmxIx9goKsPHwBApJGpnZeVj/7
                        xFuLhlO97ce4CfyeXsCY/BaGkV9BdTREqzDrhJKvqfiAC+Zj9Tr15BofSsPqGY3c4RS9qYYXGr9l
                        jSuT0WmrbHCvNO2ObWBxs9zbDEoz1OVHrj2rQoXJgZihPT/DA+VAsTbFSwuG9zrOrUDhtad8O21r
                        2wuVVPrGndA8va9cKiVvS5kzN220dhdXAmVuUPxOrhM4nym3TCP21stS7f1h3hQVLAX0YIJ5EATt
                        rqcGlmhBwXVxxYu47bLOz1kyd48+wpGh88wNXTp+Bn3JzIgIdgEr8+PCFCdA0xLDkTTx/8ekOwT2
                        Bhdv/2XdgbdYSZuAx85aQQSaLVTUcPwV3NMLJfBdbNmIOjq9bh9W8eSf0X+bUjuQUYJiWPgRKkon
                        UM0JCT+7c9CvItxoB6ZddZHJ23GdO8MzDT1BmLu/bFcjMLLOhiigUt22JV2zZY0b01Flq3xJ4cB5
                        yfFIn94/2wdbgbVuSZY55TGyzq0habu1lhTw937Ovrg/0Ofthp54v15p6Y194eayzCsDmsH2Zn1W
                        LpxIXYtf0g3v5NTzX8njGGuHP9Ghw11BGspgp3WVmML8zH3IZBKKYQOMakA+KM2qJf516YTJptZm
                        gQik27wkdZGQ7kLcLYDi2kRd1k5eDdzASzR07k9rf83H4NFnJF1kSxpuJ8eMlKwFMgiYGhIdi/Yh
                        Xn85ixRuBuuH1gDZbJF/fvY1wPM4yQFmGkQBnhPGn0Dw/ltuT9bxvL37l1B7Alr54YJBrL3cOxzj
                        0Ma8ycsL5zX+ywtsZWL2vsTnHFmWGx2DU4CDsGh2FjgQ+2BLthl4Mn9pM7u+idjWtRJTifWIwL2V
                        U4lFyGGXbhGEVgWZRajy3z12PblgMUkfxz0c/nxuq6IiqMYxNvWT7iDfQ/tdm9U2exY9xULC6twf
                        i4ZJRb2iBCWZHErDT85IQIEogQRNo0mMeDo1AAt9btCQt/8JAZ26/Pp4c9esuIECxgGztKYvuQem
                        5EloGEpSObNmFcQT5uXGh6COkFUdnwPhYoIl0zjlzWGEUlJFImssx7cbPI2DH/C3Zm80HsHDofi9
                        PrMN0/HTMtArDaMgBnotJxu7SCQmYCQUU2tmWGYlVqMNbGheJ4UgbOhmfjoGsKrsXW4UnpRFzqNx
                        JHKkZjZ/1EzCsainGZddg665ctaP5b9uJZIzLtHODOE8CfPEMAuSI22Z61GevYn+fvxaNHmJWRhj
                        yzHvBVIo0qJQUnFsQQyKwJLL6mvQgLf/D4auPTRuSEpaK3nDL5PHHEK/GR2a0LCmwdkGdpCx9dI3
                        gZGeHC8Q9bwJHfm5Keigx5FdQpqCKPLlilyEe6SBZhOlpoKK7A86+s9fHfsPMHLmLVqMWo8kpCgr
                        4pRpm64nRmOV5u28O50tvlVdgaFonNcQk4lFuEszlVOBJTiG2+6TgUU45LJeNwvHIiNpSPwZqRs7
                        FiyjKsITf3v9AhGh8/QaBxO/jyFRCvqAU/Nj1BVgj3Nu1Qm5rB/f7bfP5E4nVGXCx8FOThSG3nKp
                        CFlboaMoPD8ZR0zW/tV2BhJ3t49z56yqnQxSQQLy8LV/JjfSkqsmNr7quo49LJpoUEG8n1jE9OQY
                        SePnIM9TGsRycMNGuFZE2iQNI7YUoqGBCbjsYnP37Jje81lm+W9q7fitjuVshs1x1TvQOxJSMbJ8
                        r742J6Ida7BmJrZDK2J2VjorUbRvSyx9KgGGzPKMHO4npsqxqHjYNnYO3EpVg+bSXWLN3xH43wTx
                        vTFiPKB8BWXgO+8mpwIxlhJyaDbhSo9BAoobeKLiIsHTF5QD0e3/tl70mWb7YIYYKJCeykJGBB8q
                        Gvtjaq8/t9sZP/CizMGp88RR91Q7jI8OAlIQ5XCT5spQVET4pciPWxYu5dvoKJUbE4PHdu01pzlN
                        ju8WM9rZGjqIBoGXkUkhBkM7T+l+zGxSvcjLHLBw9jZFAoKvqYY6KbO9YFhONEUCIOe0Zji2805j
                        h6o7xNJ5R16oJZQYHYmJuHNQUVWF7SgDWDpmI1McuyMfOwbPpK7Nqy/78KmCcPHyPPJxw2sqrwVd
                        SAt5omYjt2QpG7F8ZmFeDBrdvc4BrTMJ/nkz37tWbIIPiqqqIXMYsZiVublm1QW1GLF1/Qm/8BFr
                        ZElHcPK/SS4sFZVgBzMSkSvDwkmlsQkH6hJjaWwWbQfRRRLBONW7dgnFlPlPKVkCWpgqQWPbBo5A
                        xuP6EfbY9PXcK1bYdxbfsxXFx/EGeX78KpRVtxfN56HJqzGvvmUlqwAvsWLefS7nlLcXTpWmwaMg
                        5bR03EtkFDsCwllQPCLE8PrHbyxFFbf5yy9sdOinjWuHhjkZcPFgYFYHl0GNalJ2NdfiFWlgzA6q
                        rhWFczCuvrx2PN8CmYP3gc9qxcj8MbtuP4pl04uWEnTq3bjrOrt+Lsqo04vXQ1TtH1ry1YiWtL1+
                        P85h8LLvbocYhJdzhJK1PYa4SZxfncvFumWdjg6MdrNZJWObB6HTZMm4n5gxowNCEB4fr6sCXNYi
                        Ymjj6Kqgi0dsStG1/eJeQ/wMLC3aywJHSWEsCKL0+gkYOvcVuOVZhY+q0xVjmxejU2jxmLiRY2KF
                        PWQillOkdCldS2Nsr8EvDgBwx7M5F2aft+XFmzGbeoIXYXD8ZOEpvHhyzA49PX8ObZC7x5+hyvnz
                        TiFaWXLFGI/ymRO3xFIvA1pVfEnq8psWee2JjDK6rE5+cv4mZIKvb1cMLxwBi8pAp7Q37+DRuTYI
                        k9I0UNwObfvqYO9Yal53RNSq/o/UtKr+j9a5Ya6XsuNR33+PQ5HE4pwJnwDOwPy8TilHLubvmPMD
                        ams2jwGHgI9RAor41KJze8efnrPZwekuvZSYFJXV4BArr1gL9Ja/hr6cNLoAhf9tSGnAi9JWTQlW
                        1p6B36HyHzR/sPsDBAnDtxGqZCDVjwFdFHWoiQth251ZiZvaRKu370CM7u3IHDq1Zh3ZBhqO1sik
                        IdI5Q3a8ntCjLbwo5EryY8JRSR2M0Wty5937Zvnxtb3mNzWhl2BCbgEonSI6kleHzyAt48fIZ/E8
                        v9VWOV+5Zc1AZbH1wq6/9paOBH2HsC6PncfriTlI9zUVlYEZmFO5T3HwGY21S36aa28JRRRYSSDr
                        KpLc7v3fMrsLDBunt37uDaxYtYOm0aYs3MEKCjBw+SFwGy8vDgCdGTvEcPZT0UJxVyy7J/yf4DLM
                        zYTUCv9j3Rg4BiQSdyVlHDhtmzcIIAMqe8BGV9eqFf+/Yo0DNArkgZpfLqKFHQwJCuPfH22nU8pb
                        B6iL0jQuXU4K9ujKXjpxHY/toA3b/e/4Q9Cbk44heO58XVuNavhpt+8CVjgP/44NebO7fw+sZ1vL
                        5N1ErfM2ZgvvpLxlzrEo8QnKYO8CWwsAnaj69e5Vjmt/b8/teXf31H1zxdWoZ7BWW4RiJ6S3QW9g
                        ydyl3vrxhbYmPV5GnwI43pw1PmbgJ6UgSU2bMn9q5bh+O7duPKyVOfpAIzdkvg6pnT2DpnLuJ0De
                        AryYerpCy6iPHg0qYnhleP5u4xfcm+CBYmhtJCItFSQgqWJHQdpCThJuTBT0GAED4PcfR9AV+AKp
                        ECqvhC9Bcqo1JBDSM6dsOLS5fxktIUJ2du3oQPTwUxplY4d6xpE+3vNQaWXSmZOBYUhFdl5bhRXo
                        2fP7tv8bm9e/sG+3ds5Br8ysgGHMhNx9GBldxtiRuHD+EWudTPK/CjscZjs+tODPoyWJ5cv4nV2X
                        k4PGYM3pGL+txOLprHsd+XjIHlaFV/XCmtwLnMAmyPSMXBujHcozR/xS4REBLMzOEoLUIARUExhs
                        1Q1Kc3qtxckNC9K1w0dRDRtTu2Ll+By2fO4PaVK3hCDMMCEbbRaYVpT/iQ+3EjUugkLocE11CcOE
                        x18/OXWfWLYGE9c9P69WitIk9hszi8pZp2KA+REEMSCaESCWkMkuZjGIXVg6RlUEegYVvgD9Q0wN
                        JeFljSvjMaFJSQxxNxmyQF6Blj7cw5f2mOC+eGstNxKNwPz6tKcK2q4qtgYTP2b9+8zjX4tfo6LH
                        JywOaMJG5c4eXDhwSWM9yd6d8aA8ta1xhcGDT6i2BpvH4LG+JzsIrC69PVDfiJ9MhHe3rp4hf/w+
                        wdHXd4wCCcqazBiaxC7ApNxKGKhq+C61uM1eXK6dM5QLhQPRdb22P/smW4cegg7p06gfN7dsPbuB
                        W6UaDSkdqpj7o6wrt3Q42fL7eP5cmtW5HdsjV86Hcn0qc9RFqoyaz+3fk3XwQLM1Zxbr1NYc2TRI
                        isNKLoNVpcDOkElmJK9WISmECgGSMji1qeHIqJzgawHeNlFVGvo4W16WmY6eyCXBJSPhTrx3c3x4
                        ndez+c/c8bq9gtHFi80VhZhEtVZV8Fy0djbuH9rj1Y4eCCnTkZHLP8nrEyL3MKx5m64V9s+J9ITN
                        7fuAvnGyZgr3MEzhQN4Fzh19zPR3tPYDnVfwgulg3AqbQ87A+Jw8Himr8ElkMMDD27obdQgDBdQ2
                        wc37S5A2MN9iwTE9wptg7waW4Ct+YtYKWphT4CEWzlBPBUJMaXV+Ce2PChcNlSilxR+17YtnbnF4
                        OYj/Z1sNCfcsOiKSLiI1QgQJS0FKIIJIkSEsiWlUV/usgYYpfRUrKokxBgoEADA2R1MLxNF6wfUM
                        otzPv89ElMdHFBkLQcvEjXLB8/+bv9NKvYvWnpOBHijRcElgtVdI0/AAszVoFbSefszsv/JrDMcw
                        vGwYENX2UJZj8TK12totC5jzcuFdfi36SBWP6+BhoGlstlg3G7oAqXE8iVBkdjf37Zd4OFzbWdOW
                        UiOuiqwExFhAF+/nh45iwXmc4r7ocyHz+kWtqgPjkNW6bPwI558zFrYD1SLKxgzxOQrJCBMwElgE
                        DjIsdHLzkhUoJjfxcozL4KFlbwRZPmwFVTH67i0giVlkUYsUeUUIQRNjZYFhSMSR07E6vIk25RRY
                        26CWa6BuPypOlcRbP/s9ctI0cggVxUIE8BYc07YMOcxV+t1N8zVrGHUtJxJtgbzxlYKsu/GSxbvC
                        OxM6v4m8Cy0D8WB4eO+l2wMPuJALPFjUBoH4wnJYNxZvCorzb+e9IsF4hV7uWV4EZcKk4HR2FPTt
                        F3gYWVZ/n8xehLLqSjUA7uejrYvnAh933j06cwU9eAqZIKGlIzuPJw7fChvg9v3gJPNS3SOLLwJI
                        DYkKew4knB3sgQtdUDvx8szNhF+kckwUlOBT4sCZQRadwSl0+c4H5/dO0a8khRVzbviN3Vw7jvmL
                        H/3dqyDssjA1CsrYEEcldRUiK481QR0KEvNi7b+OHIbzdWsYcJLKcJLM8qinG+4tvBstYrBntSmS
                        D+Y7DM8YnB7voxfwgWdi/pwqDhOGAXjC29PLAyLoWbQ/Mle/u8EUdqynGrqAA3EhNxOjQCO0gofw
                        9Ytm3cDf9eTrCkunQVEyJesxkOLlnODW1UZKSgWytjFCckfgLJ4a3buKiJ2dmDBxFCUWxfSWk4kX
                        SwlZGBlaIc0rzdMWkGCXQ6/vfsD8Eyd+hEBLXqAm8lbTjJiOCgoIKzhw5zv7MBrT0Da3F9xWru2I
                        +2c8IUVPXogUItFeSJpJHFk0YCiTBfWRXYsZUQK+s/HPnt1gSWTA4sj8uLcab0j8HCxjGezFiE5Q
                        7B2JVE0dA3gGWmazR29h/5h2DhGoPcT2PNKKyy9MKCmN8Hy+HactzuV4jbSUk4G0Jgyfg+sAwq7Y
                        8+8tpwE5dHpLgI6WqG2L+waad+Np4yb/aUT21xmESsbbeuSIwIwxOKfs4fPozYzl1hRWCxk5ZGX5
                        4M7Js1w/iGoU3l+awNv2S/CxZmzD/WkO9zV9GENzW4p4wQub3McfnDlncc1VHFsnRoxjTMTMtEvm
                        EbFIjUUCEvRJW8NAqEUkggkexH4spGpAKnFh0xZ8zUD1f4NmOh8764DBz08cLzmipc6k/i8o/Awi
                        qAGmRDSAq2xBVRNPQNmoWioZ0lQ/4QLMy48hNg9tQNxfCwhK+uo8fWsDlMTHgjuwAPEtJx1jMIBz
                        MK/jRY5k+bA8tmJrCnegwhLRkuQUEHCdWds+dwv3P5+bB44uYl8+Haqxt6tDLE9atXuO+ObdmGcB
                        19uBGj2LGd6dQVEerqh1nzft3Zv2Z/CBZmc8dPgLO2HrxlRQgldgmXU8So0HDcv9T0TAmbDLV0eD
                        1y2rZGjoYOcnkq3P2halk+qoUEFpEUYmQlSH1LkWCWQ08eZbKrDXYs3/hNmWTGKvZAegH2Uuj3tL
                        YK56urvgks9zdswUwHH6xJzPsmsCz0iMXOfoO+CJYXpAke3r714VOTsWv89PYdVo+e+MU5rszYOM
                        vxqmrczuuHR6l5OOMVij1J2VwH+BZj19hG5XBq1xkupEfC5GSRKCeDJAGPIlUeMkxNsWjwIBxavQ
                        LHN6/HpjnTUR4ZiAd37+DF8+f0/3+RZLiOMeGx8CeB68uXhpciH3ZG+hjeMA7vKB8/DCzsflFZdD
                        ychcoIkRQilqKfdC097F+yiPudLUcxyNcZyaqqKJBXQ5oEH1mUcgj5uZLiSJUWR7CkGBwkxNCHvj
                        OV4MFaqI0EC08c3X3omzLKwLKDKnuzvxfu1pbidHU/AsuXh6U/Gjvve6qsffUNlIZwd8Z/zxhYFv
                        jGYntF3RfBwlj2a4Bg4zZfKwfHLNVluJKfjxuku04GR2J31rcxCzvn2YPHEGPlAidFTcQIVJApJY
                        csciXJFKGGSUsS20vDV00VSV07IaFbFwS1aI58exsuv8wab97EksIS5Oi04NouWlaAIHUVbkWvZY
                        u/XT9+E1iYLZ46G+4GreAjLkCKpAhZIiVMjgzHk2tEcVSxt8+eRrVBCxTKKNDvPMSKSVCo3fRQGn
                        v1pWRDqZe4OHpTQa0k5WGvqI90ClXPHjn5h0qcVeyG3AKs9ffA/fpSXKj9Y7AwY5XNeja7Gfi1xv
                        xoDCxLKYTcXUPh8De4oW+1t43PsL88H5fys3ElNRWHQsOwI7/4D8HC8nDtxCnUh8TAWaSKKJEGcq
                        UVUS4hj37UaVMlZBAqIQ5v6pDuBBpvYhwfOXlKitzYy/YFC3FwzRpMJsHbr0Ub5AnUUCCpjCS+Cm
                        JbtEV9agE2bTrw4Wp/bN8MlqePn6Kewk9feU2kEiBKRcooo0hnSUo8np47i6fHjmGwnjEKxeUILN
                        IIo7DMnwATJMbe8xBIr0702YIAw26Js1FHO2kRrFS0UBQUgwvHTlNjfb2BWMVuzMjHtiA/PKnrh/
                        NlWbi/fw+eXL6Exx/SoysX8fDyBe718ZXLeEhu8t6FC1x6fOkinl29TNf4egMxsKz0D8N+0hdfuz
                        nJXMeL6zfx8OIlOv9lPKLrsp1RnlygPJy/iEeUHl68iPsXL+DuhXP0eg5Xtm7AlqQoXEhLxu30DB
                        whgbsz94/BwjTQ6IhopOo3QyRfiHQZAom4ENWSCiihDpsmKYsQcUl4sUeL+ZKIIhcfy5NHrKwqt5
                        NZkLYOgrQ0ESEUIltWHlWyaiiX0UCWcjOUO/hj84I1ePrs2+dJfzNYmN29cQuDIhOQyFdGuawCKu
                        Xk0F9DGTOs+mCBnR0GKmqhgjRNgrgEuSsxeIpRQYiJQohFmHL3Eyf1TWBxZlviCYRwo8L1EBOHi1
                        4L9AuKxcWTZz9R52+NVeyu9EIcCg7GnbwUnEyNxJGiTBwbWI2rm9bh3pmTXLp75jilE7hHTHfn1C
                        ncPH6C0nHcP3USF2dNxpPTx/Hi7m00kvZgr+9f/3KDk4Fls3cgjhXkfwLLT/T76/v38Or2Hby6dR
                        dPDh/H1QXLcffkKdw9dRr3Tp/C7WPH8eDESdw/Rtc9Rnmg97dOnMCNE0fp9SiurV+NYykJOB8RgU
                        shkTgXnkhuqOSrYGH5eHLvHk7v3IECI0NkScmghPRiiZQsysT5qJASoZA6WhKBxY+tekBgCeVLIZ
                        2OSSU3w1xNgJgMsQ0P3nwZRBHzFEjxUUMgqhAZoLqjLabm1ZMEaBoC+Vb7U2Bhtnf5aqRqt0AxgW
                        UgTxb9pSRJzPLQj0KxOr4C+lOGU+i7MNIpzhISpFOoQBIiRFOKoPeeBBZ3os5AAR8esjKwoIJaCU
                        Xw0DdBaVACLp+68EWGYRV7iGjzsLcvTpIrupAQhofrVuDF8SP41zeMtzB7d/sm7syehuPVJdhdmI
                        Od5BYuLVpAYLiPtw8e4t31G9jt4oXjCQl4S2B68+ghzs+bhb1Z2Ticlotj+eU42X8wHu0//EkPva
                        ewmEvPnuFncnc/03fslYGNRWIsvP73ixd41b8/zvsGYq+lE06FpWJrWvlXBe7zp08wMDYa8QY6qF
                        CQxyAZHmokpKmueegvI8stbZJLzBxF33lKSlB0QwxOKY1+yyKgxBGrhBNYvAgsYfKyiJeSQJ4MH/
                        0Eqig37IQxQenYumAz7t758potX7M/DZa7V69jbHwqClS1USsjhwYpaTTIymKoUIA6KkwVpVyeNK
                        J5knAk0FhTr2CUGCkmS4Ug2iRX5MvAQqG0Kwvf2KK+IiEc+Yrw0jBGRXAyrjDA/EYzsIrdm0QN7O
                        yGzZZ9cSMtAe9u3cL7l6/wjiUS4WyN+qb0Em9fNiX229sX9MoSfX66di1uVFfjTEEh9iWlYn1QCF
                        a6+2BvQBguBMdgo7ktdnj54khqEtZHhWOBlxfWeQbgaEwajhdWYF/tIFzYtAmNxDYHxg7DoVGDcW
                        xEPY7VEBjqBuJiXT1ODxiAR8RqD44cwZ3t27k78XcLy3DMPRA7bbyxPTANK1IomvsNWFiZ2VSOo7
                        t3w09fD+HkroeK5DGVWLieGLg/6b060iXlVNdpBKBQChZ8KMJk6936SUtQ/Uohh1gnjfRMCHVK9h
                        iyrwxpRilxpJMrylDXRbWVO2ZWjcaZk39+dYc/DRZmFw8dQb92piijELiBJ0QdMchoCpNHCgQYRA
                        XLokLFEWDcCBB2xB7upGHCSbMkEIVGUYFCCCzBMqRbqDCW5K5sSNX7ySrBTUoe3mrNUR1IDMM0zG
                        eAYVMKVmeVYXVgDBa6+mBPShaOldRiY1YFVuZUYUFeNabkl2FiSSmm9OuHmXkFWEwNtG/sVCxIzs
                        fOoSOwtl8p1hVQyimhVIaNBdVYS+dcFpuNVdEZWBOSjBXB8VgWk4pZ0QmYFpuE5dn9sKugFjtyar
                        AqvwbzqwZjRt0QTK2tx5yGIVg8dCgW19VhafUAzC0sxYaho7GgvAarG0Zg87iJWFwxAIsz+mFjZh
                        nWhmdiW3IZjoydg70zVnDu5qOxsl44eQ65IQlw0DWCn7wSaUMeBpHrHktAGUdpDLF3LdVdMdVZKt
                        Ufe2rUhT7bU/0HUCeNp86YwOqZGCeYwBJAQGF6JowAFSUvj5R2XTCjahD2bz+C6zf//BKr3wWWJ/
                        ceYnJ6ETKV9ckPKmIE0d8YavDhlPmBBJISYpskSt6UWXtiD1cSuyzz0eRfY+j7SPZAExXSh3qDva
                        w4bMin+pL/jeKrIoinCl8FLWT0scXRbb/MnGeuafuiLdhFlbxrylIsrhqH1UPnYvHABVgweBVmjl
                        iHaVM3YMGK7ViydieWr9yCjRuaZozt23KYa4zTpy9gw+rt2EjHbFixA+uW78T6pTuwafE2bFqwCR
                        vmrMOGeeuwasE6LF20DiuWbcK6VTuxY9V+bJ6/E6vn7cDq5buxchWltZTW7aJE31NaT+83rN/HPW
                        R2+eodPGtsmln4/PkrrFl3AJtW7cOmRduxf33T+sGfG8vjsV0HkGDnjb5KOrCQFMBPSkgMIYdaYu
                        Qx5FLGi0tjHGMaqstySqls7RxKLvTeWUKKwEIhsZgcsQsfSbJy3MoX7pQ8ibnZdjL+mnooCojExS
                        9sOvWt9l1gYfaQxG6DayByFDQwgMDSQBkbRGm4QA75xCwpJHKDKKOuVCBX+t6HEluyI4JAFUGACS
                        fg+BONslWmLLnfCf1sbwDyub5iPIq6FBHZqRPWL1rEFe63Bdy3/STev/sJF07fw6LZJzFn4Xlcu/
                        XL/JKfqNcu3HHkw6e/bjfvNOL2vR/7DNTHcm1csgwORi3RmUBhy5dHIEWcoRQUpIkJUUUAGC4hh1
                        EkUEcSWAZTfZVRSqG6DSFd6CNJrEy/h0spIkaMtCGxSzRpSG86xouOcedJwENJFWnWbhhVNwZTlm
                        7BuRu/PA7yZ+y7wcIK+YBCyKKeVsiQIZ9KomucnBBDKfMlBIIsokzmK30o0wwsLHnR5wDSMmwlqW
                        gCRChVjhOByoktFkR0GyVNSl5GgEii1CDSO15yPPi0MkZOXAI2bdz84cpN9rGif5s+2m8//1X70e
                        djdnDzdlQkJMGrTWvYkZB1FSjAi8LjAAqPYyQUkEpgKSJmGUAMU8+TwwDqaIxV8sm1xDOwUH0GEa
                        uEEqCixRQQS2CJIrBEElg86Rg3OsaKWDzRzBpjyobiwZ2mfQm+txzfDRZmbOuZ0TnlyDbpgCI5Rd
                        IsSmiQkEGppAyBRZJbrJC5Hw9K7PFIZ8q8F1+C9IoM9QI+iV4eByJnSt7kk4Mo1A5nd6il6Xc+uS
                        shgUVRBBsNTfj3ssDE2mHYvWnXD2+0f9JY3k+u24+1w6Yiy9oZzpoa8NZUga8yu+8mg0ByP3Eyyk
                        gisKRQHWWTBiklVikjTVgkI07RjhiSqR4jKQVy9UtsTcfEEqjiCVxRxDLBBBY3kgS9qV69DFticH
                        oZHt75648S/yWwsIuzJcbGJhcg16ANKqWUMVKoSmG0FDJJqyRRYcJZhikxsDgytBMtBpBwY2CJIr
                        CwUJqBhflXtmgQt3Yd6ZkwSlFEu+E8Agyxliu5O3bHOqCHLZbMW/jV8Zj/ZWO6a+vilai1CUSpsR
                        mSNAzgx5PhIho/WSkEk9aIoJA4mpglWVyEJHLNKQSGbOp4OXKSSOJRZENuPZzcTyAxNIsqg6jOoi
                        nCTCTAJJPWiSJmZnsN2cvJo6+iJkrC0zBt1CK8IO30V+0vgYUZA8zDm3cwOigJNZptMYCvjFI5GW
                        TzWQ9gqJeA/wcwODOXRDG/H4ElUoJFRtSTKFJizONGib16UGV40v/8SfdEENNEM5oljeMhySd3pQ
                        xrkS5sWnfAqEGDsGndarx9+21jLP9NY09L7Nm4BfPGjENYmy7IkDdAqawWioTEIDKSpOMoYiHGjZ
                        KVRYy0kFhCjoDCIhtxStTpWMdjQGHHke4LIeb1pTr0IHfP6pbdUkkmd54oJYNQ+t5NVgRn7WZI8Q
                        jHyPqpuHP7IQn8v87GfxkszDjAXLmBaXYhKGFDyvJ8ZPLEEU/+MkKcRzG/DKlzCQ4wblwURAKXCh
                        ZBQAmmV8YoDCxsxSm2H7GjpAQ86b8h5NIi2HEy7Dg+6Rg1uEmqoQ9FYL011eHSpS0mDx+CQ3v34d
                        Wrv95zfrS9ffEaF/YcxcqRkxDXsSeCtQ0o3BUgl1h1iEAVA4hJcqg+EqmDxBBbRJJOiyN9kkxCP4
                        FYJY7qI5p+i6aokq1BzOZAx1JUFEXM40OBANvLkrE2u/cWTymGOmKwLA8B2oZItPHGjcvXsJAiuV
                        dvfsx6MT8ELMwYxW4obMDQzn1RpsWWz5RAJPWAMCkRwsQF3D0iL+opLsQYXuSmQjnASJHflYQfgc
                        ObEvvNlgptTYLXhYDkS2AJIg0TSpUYQaI3VloVAWLycJOWg4NAFr3lpNBHXRHu3UwxfshIHDlwGB
                        fPXULjs//eyg2vKGS+ffE6zh44hoWDxyGniz2iVVsgWJqiFdmmm6xswvsQvgi1VA/FxKIp5HoT6D
                        WO6iKeOlcCsW40a3z6ngGFMUoUvWeAYIwTJ6ZIYFGgjsWHBwEmglglkuoumNxZgKoKEnpaY1i/ob
                        hw+Q5u3n+Gn38zwPm99sPAwrHLxRu4vu8QRnp6I16dRClbK0RaRI0tokbnE3tIwJYK7UI9IIgqJp
                        JYI4SSD4HBnwQcc1G21HtsqLc5E1i8yE35kysKpYpg7iiJzsPUfiALu8mPu5LIY4s79yFd00OoAu
                        tmbRBq7YrxNUO5laFvX76Kmxev4PqFy9yqVs8ePcXLx414+ZAq8CtD7d9ibMyGzaBnZX754CGe3r
                        iFR3St++cvYfGAkejnGISQlqZwUdaHO18F/hIiKqeQ2+I/msqbTwFAKTFEObnXEtIsqYxdKKVQGR
                        OJUaKZaKV6iiVdEkvMEkvvmauJp/qLJ10STkDxkpAnty6iTkbnJiYKoHoO1NRHVI++KEkuxNQZa3
                        Hm4p0f4n4+2g8Dy+e2ZvR0FJi7wF9ZB57EAsEk2kL4Qm7RmL7UwGzfvlACQSxVWpxQkUQej7u97s
                        jAQhXDNoJ0IjB5EmBCiFniKCVRRabQK0sJ9FsM9cQotnom0S77vzP1WEtioj7SsnBW0UYkaYOkbn
                        0Q1c4Uga27IssjCENSizAjsxrzUvvj9PqdeEbi/Bk19sc5qr+1N6/e4Nnjp3j04BG30NGje/dI0N
                        /G+X37sHrEcNw5cwbzohMw2tYNI7pbYUDL7ohlj+2Sq3GUE8BeJIKrLAlOCR7ciQFsybV6Ejhipf
                        lII6bNpbrJpZA4hcrDtEkygSSFWDWWdAkTsTEkehmbpFM9cPqFysgmzvtIyRELy1LQICDdogRvKX
                        X4Khkj0dwdAwtqcPTYOZy8dJsD84+0vwUs185cxfz+I5HbzQLBcgrUqyj2FyjAm1yHBQHFlSoinn
                        RMEgEmkcASo6AED6Jke+pFtiwRWByYu5KkXkaVk0Epj91zokrNospjKZuEYbYcDxkCiiDov77U61
                        ij+MgI4U107yNQhCdRvTMxmh31YlueEB5KmohWNkSORmtUNOuOqg59UWHlhiWjxuH506fkvp7i+b
                        NneNHYyK2kNH/kNOT6JSLc2ht+PawQ0dUUSa1bIVZDHSlqashWVUcanTdPhlyKSBOVpNcySXOEU7
                        m8yK0y8LtRBwmgRmYRHwtl7el7HypHNLFmKpUrlfKcRHlPJpCksyiSXEkysWUERY3hVBdJdGwOMX
                        QMYxUClj8xkxsxkj29WhKIrKUIMIr6SOxqi5EFA3Dm+J/bI4AB6s3bd98ErL8FLMzO7zyIRcl5KG
                        vWknwvGzchhhFQbyM340G9JJPAUkz+N4ZcCntUJIDPHpMlvcKBhQ0oSXMVE01MUkCsVMEXoII+96
                        MKZ6mMRG8/YpUc1lOpotl4QyBdJ5Qvjwg5NvVQCcH03o96rysDEkUJEdTbM0kcl5JrKKdUIKOIeA
                        JWkLoGfI2bw7GVCdw7d0JEz76I6NwTXlrGsOarwoyovzc1qgc1cLKELIpl5On/Siim7wtIYwxW0M
                        IIZT1USikSkKXJlTBhT6EtaYkAYs8IAhDTa3aUXKkDhApECGa3Pug41mFYeJwlI4NCkZBCZD4SiT
                        FjGGAIbHEEoDAqLxsBZwNwkRQSe0rzYMOXRm9iHksFcm3tO6GBGG7LvMXcKtsssScL2ay+psTef0
                        z0+7t33Pq2bylKe/a0EVU1Y/DmzR9vzvFVsLA/Mt/8S/o32Gx5Nnur6fWX9OvjmtKxVRtweuBIzL
                        N1QbqIGoQKy4ag2b2MUGrcEjEhqkmsss2tmI/2IIA4UOHZ5uN9SI/YswEqovA4aux8ou3+1KvqqJ
                        L603lqKNURWCr4MsgiFmJUze6ystl4geTzI0hQR5AfD2erBFAUxXp1MAExiS+JfuSyaikMH0xsN4
                        RYr78Sha8KbAcNMVhQuG9OxzjQdd0IwG6SsnAjMHjwZUlTySFBRg7lPAUMJ1czVKCOGml59KNr1K
                        hqopwYsoTOl0EskkwADye3wzUuMU8U/cefIiB3YkcXKkOggjy8OYAzHcLAwkBDuoU+s+kdSdQBWG
                        SUIJLj9kvwo7yzOUAexEqBdH5XAhpbfKcT/dab6iuylTH6e3uhNjIaZbEJyItPQV1RJQZml2JwWh
                        lGk+udUjAQE4sGYlBGP2SHxiLU0RPu5g4wp4CEJ6UKS9fQPxTCXwULezg6MrYQ0SklKK8egdkTFm
                        D5pEVYNGoWloyfgyWT5mP+hLmYP3EeJjaMR01hJQpSslCf2w/D43NQ0M0aaar6SKZGiafeFE49hN
                        2rcCNlH0lUW0qNWc8mdhNYQqiifEV85Fh0Q7GnHaLNOsJORYEYRoJcmDQyqeL7U6M3UO9m96CGUh
                        pBTFFLojiXKjCZABNDFRdFlZ5I502SkicA8kkXSVNlS3GheShdN46OKaRUT5pgGIFzCKX+0hLI5o
                        tzO554EmA8BHSsogCRivIIooiNhaZs/IedI4pcYz5FeFWkwSqJYQqo4StaG2FNajRmeDohTU2RGl
                        hIukXIzYt1oLwxN+RJbtCX2NFLUQm2bCheRRHBVD5WtlAqO7tLnEYdIpHqKY4Nz9N/k6hs8XQeb4
                        oqHSkltDNGjKEuQgjEPgQWJu6dZKnzUZ69yCX7EMs60PmsZPjoSuXuTuV3E2rBQ4Y0lLgqCWIVuE
                        urwImnBHsCry0xb19FDbRT0IYSTxlWDn7fB5affvoZ9UOnQlZOHTJEuQqkN9ooa8FUSQtdSAt0o1
                        7US0WTkha6C1XRXU4ZvenCPei3XmxeCv0vkCKXVMpYjpwi+WByQVRpjD18yBfHy8qihIGFfHytEo
                        lRqjB/aqCnJCAZo7F0ctdOBGppIpAaLJOAMYDc0HASdsPJpYyg40dQQ3FgIapm4w9sEwommuPE5Z
                        Ak2QSWIGIZRv+swdnQOIsoGFgaCKzj6b9jqVEGEViKCSgJBCZuHIidh35nDc7Gd9h5GWNxO6IQWA
                        oILLXkCgaxVahJt8yLCGhiW8rznpFDkKSvCT8RCVoB0xTU0ASeArOeWJ6Xj71Dh2NFWSmiOrSBNT
                        Uwt0UPT5ZCYz5iKCWQm4zl8xFJoImihvel/4fqa2BdbTk3neHc4kVINGpOOpDcGHUufxGFywISw+
                        SywomN/BgwCSwupIW8yN2G8tUQx9NEIk+DGFoFwRJyXETKxrNY8MBWU+9AbliVGNLdPZDzCL9nXw
                        HLT6gYOh5S5D74pOgVyY+2IMrvQZrDggpvoyiEnbICHJWV4KzYtN2Ig6wINkSR9mI8YhFlJMuoIF
                        1GgWOWOKJfdvPQnyIYNpwfQZWeR/pisEgLBRRWZgqUCUR8DI+JxP65M7mHsp7evIHB3t7k4yWQQg
                        1bKRRiBBVsFLmGkdRzGki/lNE5k4glwui8gdTojPYjqELiCKRxssrEDCxiEIcjNbQ/haFsvCKD3p
                        dSGki9cwj1eLYLGxv3YBtuhX4ARjCxEZvzGkZ5DySd4kufA0l/JFGey+j6NRSJDKDrVFC5B7dtiW
                        tTJ3KAYQ26dEA1wnU04EH1ZEcskti9C45vXMf9xmbPsVemGyZlpsFbUx2OVAY3Aoc3NV4QdYhgco
                        Gh9BpJLs1XIESJl3vTf1knomtsHDEakWwhHiqPF69pP4UoYpVoOXJZ5LodqCwO1Gl86P8+JO7D2C
                        xFGSVqExFXDgYU7qYuG3qgOjWlNlaheuvZtTeWrN3yu+zyVWapHjUZ4tR7paih1OUFaEMZ6kE9rh
                        ddxIz8aR/qGTbkLx0FfNiQYrckl2FBGWW7n/mTZoiUkEcigSBaVsjd2PKVIdQTULwJKOEk+tJJHB
                        bJUURBQjOKkO1GPcJdQwNeJDQLQgNx9vAhXD9+nOuVQcQe7GH8gcRSI4hCR0gLSbNQhETnjCBB7E
                        WJRVjuROHe5KqCiQ1DBRRhkcZgvZvlk43HeFCeWa/Npe9r6Fx1PHmU0fE5BJgkAh8DCmMWT6pkX3
                        KP7iRMHUmIO5CbcCPAh1C+M4kBKohBKwm4pfLKyFFVQUmblhiflowj82bj+f17mFs3AE6KCuhNQJ
                        g/ciTX2Gxtt4kD6jCquASrJk7kNvhcOWIogui/VlQ2ZzYnmcDnSuf3Ip3jS+LcWSCPDDcnDij71q
                        /FvFGj0D8wGD5aunChjusl4MGPOjG71+ZN5XKnVxae2xBobIkB3Ym1vCg69CTQOxFQrKhsltRR7M
                        mFuRCb2vGk0Y06qR6VTZGuXVBWh/dEFF+zr4KlYthUiFG0IqBK11VQRluqYEcNTbiSa3BQV4Ez9R
                        5PI1146lPS1oM7od1RWxeOmroI0jVGpH4rxJu0QbRxC4S1MEQQ+dsAbU2EaWsjycAQabqGyG/RGv
                        nG7RCja4Rgw2bwatECtkYG6EPHDijIxZUzZ3DhwH6ktzFBtqYGCqgSB4lUMZAauZiN0RCrxGsoI8
                        JAG4EGOggy0EOorgEidJshQq8FQpu1gAedz1ZPE04tDAiIRog0NKJrGyBdQRXJxBJJJHZjqWxhVF
                        ke1GChRs0QZtIWXnrN4KxBPdjQGC4GzSlvxghu2QJxLSnfbYxRZmKCQgJ2UstmSO/eHkkdKRx3ss
                        PJtauwlZgmzd4afam8A7Iz8fTRQ7x8/hxubTrB1agV/Np2wNLJk7F09HCkeDjDvrkRvOh8Ac2Mub
                        Xewg2o/lq0QVib9vDp0gkn9+yhUP4psgID4dGuAzxatIR/CxOENqe86ulTWQ0QRvXH9lZw0tWBja
                        4WrLU14KpLoKI2c6ZQ353qyMlAE466atSGSnBUkIWlrAy6k3hvTqDikXuKS8nlIqmv2RfBwtBVNG
                        ACJCSVoCTUgBqhs62UEPk2jjiwZi1uXrqIW5cv4faVy/TK0hUu3WTp0mX6/iruULp7lb1e4RI79j
                        b95w4df48+s6VR79MxD+iYu/S+6Rj6P6Vr7Nw3bnBLWrHplA+uXcPVAwcwsGUbFBO9FlADpxFtRx
                        GrHVi6GHfZuSlx12Ln+pg+nPM6nY+d99bVpu/uUh7WDhmORDVNYi1iIgKKj7wiknr2pN8pP3Q9Vh
                        a2W/ot+tz036u4fY3KQ+e4f+0KtxvrfXYu9nr9Gu7Rbyy9IGC8fvYMD2/f5q577/atTyuUs42ebl
                        6i/Fy8yK2z/4yOZb/fYOenxPJ6m83XZee9co3Lxw3KK1tlkrHL/Tt3cJ1+Z/lhxzaVl8pN52X/Ye
                        e4SZ/Zda9fojLT+xv0ytItqp+bV9h3l3Bg3RoU2dugF+mczsRGzciDyBBYIuLT8e57wFJYORo8GV
                        WokEhSIx3Sjvx0gZUjjq9dhzsXz+PWxXMEkCbQPH/8mPsfK9ANqrC7N5vWb2P2srGRu+v60dgs/c
                        fUAM/v/3oFyxcPHnJ0/SVj3986cgij+loijbQRux2fSKI5gFzk6vFjcf3MqV/tb8SOf3L/13NMHz
                        24/0nAvW18js0jRiFZVx++5K+DyFUysER36oirJ05wILhx/jwH9q/liZWvkQD9/OYtrtzMXtA1Pz
                        +egf31Z+vJsuPYDuy3LxIIqdEZSK5SA37czZ7tzPLo+k1ugjkzdnzjb3bmeET19vkSZ+/evMXLZ4
                        0fPn1oA8r3NQLIx3yxpTg+f5LyxcOHGB4SAUsKXNqShNAnlpYisITGpn4fWIqrRkFaUgQFSgbEKp
                        2Isr21DZDVty9K/TwwLCsRWxbNwfXzZ/HsQVPDsMwlR4ehJJMu+u4tNxI6d+worCZf/urlCy7Dp7
                        ZsQ42bF2b378/9hxnrQWMz83Bmzz6uItgMd1aRL6miWeXfOHUCte7OyG/dBpEkWiMpyokiEcgmC3
                        lrqyO+rxk2LlrArSLArrF/x05MGjyYOzfL0xUCdH1FCdd4TCtsHDceBV26IUqJIgTy7aGyBDyhCC
                        4kSmO6dcOYtBSUh4cj09eXG9H93Fj+2BMEbDHCDRVVmJmS8alRVjYM5ZY2ZcZAwpZGO7y9aZd4Vo
                        5TBw4h08kL/SMTMKeuHnNGjcSkEUO455GZXTp+CqW+odi/rumR0p/evceYwjLqkFe5a7COV0eaZ9
                        emzXhPv7FOuGX5akwZPAJPPyy3fpXYJNjDA+GensSE17nv1i1eir1bt3I7nbEBuQOr1yO5U2/SSk
                        poSSDRJXaVJFEcFPOdYMmvGQYxEnZCoigDUujdKPWhSrXTVEFDbgYObN2Axse/Rj3LWPc2zeBh3R
                        tv3rzGgS2b4E8N6dCxDY4d2Icnt++g1M4ZqX2tsX316g//AgYnpsCORFtVUDieP3mCkwcPISM4BP
                        t2bOce55jVrxDW5HICFRQRRL0gkkRgKBXQl0JNW4rUupL4jnd2wNVzZ4hBHiDQyQnRfn7cM9osTz
                        GBfvBzsOU+nyEgpZJo9iCBGErRQJRAjqIPHvwpsbXru5Norgj0weo5s+Bm2hXH9u//FVswl8L26W
                        GbT01OSEZCtx7cNX4igPf38ufyz+zEjl3wN26LtXPmc5/Zrh1hPcxhp2eMzUuX4/Kx4xx7XaY8f+
                        z1B7bugJ2+MdbNXcB9Zmzp3b4rCj0oPKdr7F25Gn1IrwRZ2+LBnbvkVq4hxjsQ5m07Yf3SFRwQKo
                        uKYExaZcq4cTh75BjHpuOHDUd8QADn2u/fuIlCT/qPjDK6icmhBYl7bZ4AEiTkA2LTvg8sWQMbIE
                        bRj4KiAGoUlrYnMdSTGiy2TzfcuHCOo+HXxBbPnjymHt00l4QVyKZLK8ydPJaj1rvkkhZNm4xZ48
                        dwvvnRrduocvfGipGjueM/2j5ybXNGjMC+NWu4xjh99AhyIsOxb+d27lmfucWFsJKh0JLAEkaMEi
                        cnRAQxTAC9d+Tx4KKjjWl1NXjx9AkHiOUL5mPOlCncCo0sTzmxUShPT+WY5dS2bUgxM4UnRXihQj
                        lEULlCKSrwoUjJU8RHX4qcKoO8OYBsXrMSW1Yu5240sgZlC+aw71nZ71OvHRQagVwXV+4adxauRG
                        kPC7wkymd2isASQSJ145x53Ge2oHJUxx7IdvXiPjNj7NNILvyjezxC/xmUmonHH3Z2Zy4mrJsZSt
                        z9uWtsW7gIrm07YtLAQRz4Gon1li1YhKnjx5POu8IxR0VRPjzsbLnj2eOvjN3rysswdmgDx5IPSE
                        vlB4Sgq6Q8OokLYUQeQ4MiO3EJOfjFZXwfWHIGE7NQuKmkpAA1CsfaUk/uQv49084G90jUNT66j7
                        qMeFhTlDG1dgD3P5bBIPOeHBWz97+1R1QJZY6uGJ9X2FTprECUObYu7efHnz12FCUJMTi8excHls
                        XELM4UXvoTu0UQQELF2V6NbHSWjStIIKZdO1w5+eWlU9l5s0NCUZ+dy9H2yc2bkN6jB/xE8gghoL
                        FnmCIJiGHs+SZpSfSSkICjvgaekF//mCcGjp2rVqMuOg63Tp3mljmf3zAEowqLsGtx07Jnt5esQh
                        ExB1uWg9kZavhYAsvmT2B5jtgupigi18aMlbuawOasrsWJYWaHtm3HwnETftEwBO7QTt0xODiKu8
                        auRYuQZG6FWxd+0SOfG2OWAcV5cOjWhesYlw8fwcT6eoyg9nn2IV93b91Eio8PtacAbaVFFDYLoC
                        KrSF5EAL+E7O8DS8HAUXQCHhSkRNCnE/XkqcCar4KYjt1JUJ5FI1Xm4PQs2OoYYkppk/5gBXBp1h
                        pLqwfiHVuCgiqZgeIjMBrv3Ue9mw+iW7XDvvnzuO8WFffDqvJKTkuwHsa+O0nhcn6QPw6TG3pPYF
                        ldVAhHAogPgTVDTQOpfBHiCChhlNg6rv703dEtW7j/c4ldk14/5qk8IgYNKVlcTz2zaSsyOpnCnz
                        3+ye7mEujipCixQS1yRW4kms1kJNBHSR5PyN2wub6X9h9EroMrfAxNsH3+Iq5cH8/98f2NZSuR1d
                        PsE1jOkrtLNGmDrXOb3BBjkWQrc4RRZ2J5WztzKsKMWxEzCvGQRDKzfZs2oRuFstOHDuWu+5zC5Y
                        BWbTE6Mp671qHly5HQpQdGh8fiKbH0x7KyY9nvDCwN+VnoIC9EXUw0Bzb2/ed288Y1RHi4oAUxcz
                        NiFXUpOcjzFCDG5sSkFHynZqkeBRlpBSiTwG1OYOkuRpQvUIOFjADHdjbNsGchsoeuCeZWDeL+x7
                        4LMGoDb3V9rM4pwfLYdGQbd8D/196VR0V15F2RfemmoREEIcgioKgwKoqCooLs+77T0OwIAgrIpg
                        KKIKiERIO7EeOSmGSSmInRmHjQyLjExLglKkTUUYJGM0Znkpn5vju3Hmdmck50kjP/zPyROqdON8
                        3bqurWvff3qt6rqlmzcYNRxrcM/Vb6+CFcpkALpUFU9O8aVyDeyhIJtjboSEuWXuZ79dOzaMvNwq
                        Xek/iBlfxOaRkSGbGkGcqRTMDksJEFu6QyfI7U0EAAv6fZO2JTQSG665chlZ6kuaREuh6Rq2Pj0V
                        lEPWblXf7gQxROckeYFsHGiEpNxhK31pN5DDEsIB7cDzTQl5ZTma6lgVArK0TQTwUaKRAsQGrjhB
                        M7d0vHFWb3ZNdL0vfBg7/DEjKWiAzF31d6epA3zglHdw9v++S7R0jzmISZZobY3VIv/daamobi8a
                        7SMIdIp2hcp2pqYTLl0GuSPTICfLDAVIlXikul7S8dfAeZjuMRYmSClfQgG2srkRHki7Cpk/HRW2
                        9IsrO5shxTaBti7MbihQyVtESM2Pcf+fatAahiwmHHsj+nbQhTgkVfR4YRYkZjSfV/BpZagkVjhD
                        4s2QMd2EAebBhx+zqYFRllYYYzRw4zBLuPjWlqbKmolfYTF6O2dYBKYYZCYyWWKkajXE+BcisbfH
                        H8OB6TWbaERyKCRjnK2hzdyyqlfXraW1BoOwYdgX485hCunjvDqCAEZw6/L/3/Ec+TQAZINZAjUV
                        fMuBNjG5rSY7GBBEuwhrh7Sc2VK5GgtEQoGzbVzgGntu+U9l/LXlYW6CvJx5c9xygH7vCh5IQb6i
                        JGuguqjVhWsHjUU4wPiYWaxBBBkBjtJWBEjqZ/y6AM5ugaoMTMAmu95mCt9xy0+8yTziHyRpUK+3
                        LV0mKV/QR6mesE1HjPwu1PTkv+rtTHEzN0RmC+ubHECie2b0Wl1yw8GBxeYu4UmWUm5XA2feI0mQ
                        68+emjp4cOAkMc/+ahQ8hxcEKkkTFiR1vB30wJD1673xhzvL1tiyTnh5ubpBHpKBNT+FOy1VOnIc
                        VzBnIjw6UIc5CSl8fOM5qG1ooSZKpnhBGMLkfSt6Qv/A+YRdzBbVizBVojZbDUl2MMG8RNk4XUG4
                        kA3ZFYwEotnzkDu9l71wSHIdnaDlvzC3GitR05xibSentVxsZoV1qggTRbpK2N1XO80J2egoYJrk
                        hmBBKuoEG1UeJoe7MUhu7NUmHJKCX20au8VlWCYg83FE35DV4rK8er2XlII20m09gmyo0RSo8RxK
                        hFPHi/QDTqCA1p4lMiTVqSpiESqcVJhqY0nN44tv55rImOgpfSBM1syBZVKhJdHDFfpo8AsTI+I6
                        BQPR2G4cMTlMTYifSkAY8rwCPmBsezQdK4nVpXH/k8TzlBu9zCGhUEZ63FGLzL8LmndjkaJ05GpZ
                        0d9qjV2EmfVOrsBJWNFZrDArGrrBjq8eMwR5vnoA8Ua09uycpEmoMdyn3noZsmfnVCLBYoZPCgj/
                        LWEoOQ+tJ7ahPMzFjXi1h/GSiwtkUkw30xYBhtKEOYTAY/Bh6pLk7YXJSH9RGhSFQQTIwUE5WjEM
                        A6m6arA3ceNzc6EnULF9LTeEDJUFmpqQdjfRl0qBaCWeaFxGH3b48QME+/5f8MZvkblrZsggYlyJ
                        ySYSnAQh1fYKxLitZEIAscYcQoggyTam6OMIbXqSYmKOL3LDbgYkYatYYECFmogRRfwoLnynRRaC
                        pHvhElRFsLKcZiDEQDhZasiOwsrLN3QJPMGBVKJYp4XLVcDrWBDIUKJXIVJkimXIhh+GiZIfy1NT
                        CX1yQmd4cQmPHs7Vmk5ixqbzrDwUzKZ7bRKCQK2bC0RQobdBYZ0svYFHMV5vDSk8NTUxfeI/UxT2
                        R6H38NMU/EgGDRJbsYIJaVF0Pgic9YbSNEMWSPZZip0hCr4htjsaklSuSjCHBrlJlZo8raEaUWz/
                        HarVFibY+FzzkgnZ0lnHQfRYCnjrFGjJk5PYoBErlvnGwUUs2sECMzRYS4g2xqikTWX7RcgVBuE8
                        nyhrEuEwnSJH7PZucrtrBADsGRR3OeTVlOpZRKI81iUJB1GiWXIZ1eS7xnTsX6iyErzaNhd2M9TT
                        DQxjiFHHamJrAjWK0JJgX319XWgzbBr2mghHdQLO49eCix2NPSM8FS0dpFg2sEE0MTWPKCXEnJfn
                        IWQK6DKEMtROtrIprhZixRGy+G8tkDs5gLyUCV7PWN3KZVXxtNbNgygitbb3imeraIPthj07i/io
                        DL1RcTsUeigShvoYY2yE1RSJMnZtAtZGPlkipTtcgqRjIEcF9fgsOfVD2XFenL6wpglCZm+ycYKJ
                        BiqESSjgLxBEsczXiYjhxRBEcsGy7GdRrCJ3oiyHkawlw8+LcnYl2mI85xKpKdPZBsPwUhirHwHq
                        GA5wgjeGvI4aczCvGWzsh1mYGc8R4ocPVApfsc1HvMR7NPKNYHxGKNbwSa54ahaXYwVswOwjLvIN
                        R5B6J+ThAWe85HLsPlNBd3hFvZYy4B7KNnSjk347WbEPQKzGa5Z7Gs8ymjYUamCCWTB4kJTpTYUO
                        HLKBMqEQVShrPoZ8R85FLKUCFZTtycTGFO4O9i0ns42VBMaxDTOpIJlBiy0jxNDcnDuMp1MVauh1
                        EGWlDqasKUnsyQDKXN82poGUGD1+LuE/Zvlxl+pgzVrttJsMih0DeBPZHvxgP7kxWiSXkCJPFEcq
                        qODtLJKio2morozWdvX8ILrmNu1dPAGh0NNBJkpczZAijMBbzwAtK+mFaQywKIKYSlLGgzQdHKHr
                        yMvX4RDexC/l3K8xdoki10TBCnq5AWJBArq83n9XjQR81ir51PKQi3skWiwwRkEhC5U7yQNWUW0q
                        Z5QzXbF3lhEViaV4SaJcuwbFkbampaUVe9Go11bVhZswYrq1rQwtxU1oiihDwkzotBFBs+enYIkh
                        fEYnFGMdqqVqKjtgXrlq5GZ007Xlr2PHas6sIrbdvRVdeBl5s3YeeqTdi64kVsa9yILfzsWt6JDf
                        Xr0Vm/Fu3VrajJrUKKfyJCPQOhIsjS50UgdNJMhLl78nMq/BlFBtk4I3SMA/yNzeHLjhPEaCWOkp
                        rGnE2Gy2P588h8xWzcfGY1f0vRJAsRbGJVf/HynjjWSTLBFEWZCmCbzWYbObN+rdlmljTOJgZkE3
                        ZWHXY6Q0NjKC3t4DhxBrz8Y5BUWIMfnvEuX5GeySzV7QSLthkMtOSwoVueSLQvIOoTKBXxvJB4mk
                        pxY0y8DFk8+JRNsJSMGIlKfi7nxbTpaZIpRmI5maaMgMgnovNJhYU0ydlko1gCKpkFyKRxLGBhKn
                        l8sUhEGY1WAXuYmI+i1jKFSs+C8mOJIP3RSLSdiMixroibOB0BTpMRN30O8kNiUZmsRn12MZoWVq
                        B5cT1WVTdg84ubceXiJTS1r8fAzVv4w90h7Pvg9/j82gAOnTyPzv3vo+fsJZy/8hU27zuCA++dwM
                        2bd9DfP4C+619JefPuN7Fu26u4cPkaPua2J5kHB7/B0NcP0H9jkPucweDd+7g39BD37z3Eva/Fkw
                        DDn0ODD6Ttzl/ox5Fjn+HLqwPo2vE2Ll78Eq3rd6GlbRsqq1ajtroFdZUrsTi/AovSirA4JQ+lka
                        lQTZ+PFJdpUDtPQfkkT1SR2Sod3FBhOwFLx05E0WgnpMitEa5vRiNrTN+iQABVwN/ABJGUxiCFBa
                        aTcSdT0ibQkDsyqhtrYwOnCRMw3u03zNPgHx6PpNxy5FY0Yfnzu/DlV09f7u4f6algEfNtz164Br
                        eZwbC3nYRxJtZwMzCFL2k+hlqbwF4eR61PIYhyqHWZlAs16bSEYZgATAV1spGgaKG5aiAdlhEcud
                        TRHOpkDgGXrENTSdQHcLtQSlY0fU02/UTpGDsUOLpI9x/ibcchdZwbCknpC4OSkOEXhyXpJajMq8
                        QK9vSlixvQtGIdOjt2YHPXXhw/dgo3+gZw9swFbOl+F8d6P5cKfv3Wvx6JGPz2O/z1b/+HPz75M6
                        7duYfHf/5B6hj9d+5j6OFPX8Q39PAR+u/ek7YR2z75EUWLOrpz/+cfZhNm8eGjP0nRz+A34p20/4
                        8bt+9h11tncOnaLfQP3MU7h0+j9/RFfPjRKXRteg3v0mSePHocTUua0MJyvlC9Ch2LatGWV461ua
                        VYm12K+oQclAQnIY8slRcSjxya0wy/cCnnhSRAHRyHJL8IRPmGIikuHcmqPMQwv7B1B/a+eRC5Na
                        vQtfe3uHj1BjbuP4z+P/z8g/NPBYtIYsee3nN49+ARlGSVQs2LyqRWq5ynIsNmPE2aLaINLBhSmi
                        FKS4EY+gTxoFMSQzLVSB3SpC6WMiKplikl9okjmKJJncny0ciycULG+MmIcSTtMsRNneyOKt9g1I
                        XHojYtE2WZahSlq7GhrQOHeP69rx3CiZOf4sVd7+D85T5c7ruFS9f/la/03caTPw2PbIvGuXz9Dm
                        4PDt8c+19NfQMP/vmu/PsPH+P7H/6KxyzD5b47ePDHx9Ic6C9Yzi+u32S+gUtXruPS5au4zHzxwh
                        W8TkC9934PDn9wAhu2HUDn5v3Y8vIBnDn9GTo37MHZs+ex9eU3caL3U+x64wjaWXdvHz+Lr+4M4f
                        a9b3GOILn19fA9oS8Ghqez/lx6Jlh+nPqu3cTB/e9he/MGdBTXopl0WeobjTjn6Qgf64ZQG1eEWL
                        swOyLK2oly4YwkG3tk87PYyQ2Z4yYjkt9Dn3NBqrs36uKy2Fsa8d7e/WhcVEldX4WdqzuxY81G7N
                        r6Co4e+xinPjmPofvf4Hs2vkC96MmfsiJ/TcNJsN4jguu7J9+j90IfTl3sw7Vbw41++vO+YRD035
                        WmSd5kx+m9cAPfcftH3H7wwU9Z9JekXwQWka4R5b0ff4bTROehA+9jT9ce7N+6F3u37vlR3s3czd
                        +78Srz69u68cb2buxj7mh7HrVVTVjd2ImXNryCg4eOszf9BTt2vYVjH/4ep3rO8djn0dt7AY8pE7
                        +m/730i8Hy4zREGhsc+umikv8u3adfeP3oabx+5CzeOHoOBz74BPup1W999NkvosBf0387AX8HKT
                        CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
                        </br>
                        <p>Hello ${userData.firstname !== undefined ? userData.firstname : ''},</p>
                        <p>Congratulations! You have been successfully enrolled with TN College.</p>
                        <br/>
                        <br/>
                        <p>Regards<br/>
                        TN College</p>
                    </div>
                    </body>
                    </html>
                `,
                   
                  };
                   sgMail.send(msg).catch(err => {
                   
                    return console.log('<>Sendcatch<>',err);
                  });
                  
                  // let config = sendGridConfig(userData.email, 'noreply@tncollege.online', `Successfully Enrolled`, `Congratulations! Enrollment Successfully.`)
                  // return axios(config)
                  // .then((response) => console.log('Success! Mail sent.'))
                  // .catch((error) => console.log(error));
                }

                if (packageItems.book !== undefined && packageItems.book.length !== 0) {
                  packageItems.book.map((bookitem) => {
                    const boughtItemRef3 = admin.firestore()
                      .collection("zSystemStudents")
                      .doc(orderRes._uid)
                      .collection("boughtItem")
                      .doc(bookitem)
                      
                    if(boughtItemRef3)
                    batch.set(boughtItemRef3, { itemID: bookitem,readingProgress:0, type: "book", createdAt: response.payload.payment.entity.created_at} )
                  //  boughtItemRef3.set({ itemID: bookitem,readingProgress:0, type: "book", createdAt: response.payload.payment.entity.created_at}).then(
                  //    res=>{
                  //      return console.log('book of package added to boughtitem')
                  //    }
                  //  ).catch((err)=>{
                  //   return console.log('package book boughtitem err',err)
        
                  // })
                    return 0;
                  });
                }
                console.log('<>package quiz<>',packageItems.quiz)
                if (packageItems.quiz !== undefined && packageItems.quiz.length !== 0) {
                  packageItems.quiz.map((quizitem) => {
                    const boughtItemRef4 = admin.firestore()
                      .collection("zSystemStudents")
                      .doc(orderRes._uid)
                      .collection("boughtItem")
                      .doc(quizitem)
                    // console.log('b5',boughtItemRef4)
                    if(boughtItemRef4)
                    batch.set(boughtItemRef4, { itemID: quizitem, type: "quiz", createdAt: response.payload.payment.entity.created_at })
                    // boughtItemRef4.set({ itemID: quizitem, type: "quiz", createdAt: response.payload.payment.entity.created_at })
                    // .then(res=>{
                    //   return console.log('quiz of package added to boughtitem')
                    // }).catch((err)=>{
                    //   return console.log('package quiz boughtitem err',err)
                    // })
                    return 0;

                  });
                }
                if (packageItems.numberOfQuestions !== undefined && packageItems.numberOfQuestions !== 0) {
                  const boughtItemRef5 = admin.firestore()
                  .collection("zSystemStudents")
                  .doc(orderRes._uid)
                  .collection("boughtItem")
                  .doc('noOfQuestions')
        
                  const boughtItemRes5 = await boughtItemRef5.get()
                      
                  let dataExists = boughtItemRes5.exists;
                  let noData = boughtItemRes5.data();
                  let finalNoData = 0;
                  console.log('<><><data exists',dataExists,packageItems.numberOfQuestions)
                  if(dataExists && noData && noData.numberOfQuestions !== undefined){
                    finalNoData = parseInt(noData.noOfQuestions) + parseInt(packageItems.numberOfQuestions);
                  }else{
                    finalNoData = parseInt(packageItems.numberOfQuestions) 
                  }
                  console.log('finalNoData<>',finalNoData)
                  if(boughtItemRef5 && finalNoData)
                  batch.set(boughtItemRef5,{ noOfQuestions: finalNoData })
                  // boughtItemRef5.set({ noOfQuestions: finalNoData }).then(res=>{
                  //   return console.log('Questions of package added to boughtitem')
                  // }).catch(err=>{
                  //   return {hasError:true , message:err}
                  // })
                }
                // await batch.commit().then(rec=>{
                //   if(userData.enrollmentNO === undefined && packageItems.withClasses !== undefined && packageItems.withClasses === true){
                //     let config = sendGridConfig(userData.email, 'noreply@tncollege.online', `Successfully Enrolled`, `Congratulations! Enrollment Successfully. Your enrollement id : ${NoOfEnrolledStudents.NoOfEnrolledStudents}`)
                //     return axios(config)
                //     .then((response) => {
                //       console.log('Success! Mail sent.');
                //       return {
                //         hasError: false,
                //         message: `Success! Mail sent.`,
                //         user: response,
                //       };
                //     })
                //     .catch((error) => {
                //       console.log(error);
                //       return { hasError: true, message: error };
                //     });
                //   }
                //   return
                // }) .catch((error) => console.log(error))
                // batch.create(purchaseHistoryRef,{
                //   itemID: item.itemID,
                //   userID: orderRes._uid,
                //   createdAt: response.payload.payment.entity.created_at,
                // })
                batch2.set(purchaseHistoryRef,{
                  itemID: item.itemID,
                  userID: orderRes._uid,
                  createdAt: response.payload.payment.entity.created_at,
                })
                // purchaseHistoryRef
                // .add({
                //   itemID: item.itemID,
                //   userID: orderRes._uid,
                //   createdAt: response.payload.payment.entity.created_at,
                // }).then(res=>{
                //   return console.log('item added to purchaseHistory')
                // }).catch(err=>{
                //   return {hasError:true , message:err}
                // })
                batch3.delete(cartItemRef)
                // cartItemRef.delete().then(res=>{
                //   return console.log('item delete from cart')
                // }).catch(err=>{
                //   return {hasError:true , message:err}
                // })
                return
              
              // }).catch(err=>console.log(err))
  
                  
            } else {
              
              const boughtItemRef = admin.firestore()
              .collection("zSystemStudents")
              .doc(orderRes._uid)
              .collection("boughtItem")
              .doc(item.itemID)
      
              boughtItemRef.set({...data, createdAt: response.payload.payment.entity.created_at}).then(async res => {
                console.log('Item bought ',res)
                const purchaseRes = await purchaseHistoryRef.add({
                  itemID: item.itemID,
                  userID: orderRes._uid,
                  createdAt: response.payload.payment.entity.created_at,
                })
                console.log('item added to purchaseHistory')
                return 0;
              }).catch(err=>{
                return {hasError:true , message:err}
              })
              cartItemRef.delete().then((res3) => { return console.log('item delete from cart')}).catch(err=>{
                return {hasError:true , message:err}
              })
            }
            
          
        }

        // const callInLoop = () => {
        //   return new Promise((res, rej) => {
        //   })
        // }
        const promisesArray = [];
        orderRes.orderedItems.forEach(async item => {
          promisesArray.push(loopFunction(item));
        })

        await Promise.all(promisesArray);

        await batch.commit().then(async res => {
          await batch2.commit().catch(err=>console.log('<batch2>',err))
          await batch3.commit().catch(err=>console.log('<batch3>',err))
          return 
        }).catch(err=>console.log('batch<>',err))
      }
      res.json({ status: 'ok'});
    } else {
      res.json({ status: 'ok'});

      console.log('NOt verified')
    }

    return 0;
} catch (error) {

  console.log('Catched',error)
  res.json({ status: 'ok'});
    return 0;
    
}
});


exports.sendEmail = functions.https.onCall((data, context) => {
  try {
    
    const currentUid = context.auth.uid
    console.log(currentUid)
    const { to, subject, msg } = data;
    // to, from, sub, msg
    let config = sendGridConfig(to,'noreply@tncollege.online', subject, msg)
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return {
        hasError: false,
        message: `Success! Mail sent.`,
        user: response,
      };
    })
    .catch((error) => {
      console.log(error);
      return { hasError: true, message: error };
    });
    return 0;
  } catch (error) {
    return { hasError: true, message: error };
  }
});


exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  try {
    const email = user.email
    // const { to, subject, msg } = data;
    // to, from, sub, msg
    let config = sendGridConfig(email,'noreply@tncollege.online', 'Registration Successful', `
    <html> 
    <body>
    <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
        <img src="data:image/png;base64,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
        CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
        </br>
        <p>Hello,</p>
        <p>Congratulations! You have been successfully registered with TN College.</p>
        <br/>
        <br/>
        <p>Regards<br/>
        TN College</p>
    </div>
    </body>
    </html>
    `)
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data))
      return {
        hasError: false,
        message: `Success! Mail sent.`,
        user: response,
      };
    })
    .catch((error) => {
      console.log(error);
      return { hasError: true, message: error };
    });
    
  } catch (error) {
    return { hasError: true, message: error };
  }
  return 0;
});


exports.getDiscountOnAlreadyBought = functions.https.onCall(async (data, context) => {

  try {
    const currentUid = context.auth.uid
    const cartRef = admin.firestore().collection("zSystemStudents").doc(currentUid).collection("cart")
    const boughtItemRef = admin.firestore().collection("zSystemStudents").doc(currentUid).collection("boughtItem")
    const storeRef = admin.firestore().collection("zSystemStore")
   
    let totalItems = []
    const cartItems = await cartRef.get().then((querySnapshot) => {
      let data = querySnapshot.docs.map((doc) => doc.data())
      return data.map((item) => item.itemID)
    })
    const totalAmount = await storeRef.where("itemID", "in", cartItems).get().then(async querySnapshot=> {
      let finaldata = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let totalPrice = 0;
      let packageItems = []
      finaldata.forEach(item => {
        if(item.type === 'package') {
          if(item.quiz!==undefined 
            && item.quiz.length !== 0 
            && item.book !== undefined 
            && item.book.length !== 0 ) {
              packageItems = [...packageItems, ...item.quiz,...item.book]
          }
          else if(item.quiz!==undefined 
            && item.quiz.length !== 0 
            && item.book !== undefined 
            && item.book.length === 0 ) {
              packageItems = [...packageItems, ...item.quiz] 
          }
          else if(item.quiz!==undefined 
            && item.quiz.length === 0 
            && item.book !== undefined 
            && item.book.length !== 0 ) {
              packageItems = [...packageItems, ...item.book] 
          }
        }
      })

      console.log('<>dis<>',packageItems)
      // return packageItems
      return totalDiscount = await boughtItemRef.where("itemID", "in", packageItems).get().then(querySnapshot=> {
        let boughtItemsArray = querySnapshot.docs.map((doc) => (doc.data()));
        return boughtItemsArray = boughtItemsArray.map(item2 =>item2.itemID)

      //   const boughtItemDetails = await storeRef.where("itemID", "in", boughtItemsArray).get().then(querySnapshot2 => {
          
      //     let totalDiscountTemp = 0;
  
      //     finaldata2.forEach(item => {
      //       totalDiscountTemp = totalDiscountTemp + item.price
      //     })
      })


      //   return totalDiscountTemp
      // })

      // finaldata.forEach(item => {
      //   totalPrice = totalPrice + item.price
      // })

      // return totalPrice - totalDiscount
    })
    return { hasError: false, message: totalAmount }
} catch (error) {
    return { hasError: true, message: error };
}
})



exports.sendInvoice = functions.https.onRequest(async (request, response) => {
  // response.setHeader('Content-Type', 'application/pdf');
  // response.setHeader('Content-Disposition', `attachment; filename="Students-${new Date().getTime()}.pdf"`);
  // try {
    const invoiceRef = admin.firestore().collection("invoices")
    const ordersRef = admin.firestore().collection("orders")
    const storeRef = admin.firestore().collection("zSystemStore")
    const studentRef = admin.firestore().collection("zSystemStudents")
    
  
    const secret = `Y9u'jcQuynb"#y.-g2kDYpKyJmYUfsE6/Xv/R!a&`
    
    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(request.body))

    const digest = shasum.digest('hex')
    const res = request.body

    if(digest === request.headers['x-razorpay-signature']) {
      console.log('Verified')
      const orderRes = await ordersRef.doc(res.payload.payment.entity.order_id).get()
      .then(doc => {
        if(doc.exists) {
          console.log(doc.data());
          return doc.data();
        }
        return {};
      })
      if(orderRes.order === res.payload.payment.entity.order_id){
        
        console.log('order success')
        let itemsArray = orderRes.orderedItems.map(item=>{
          return item.itemID})
          
        const boughtItems = await storeRef.where('itemID', 'in', itemsArray).get().then(querySnapshot=>{
          return querySnapshot.docs.map(doc=>{
            if(doc.exists) {
              return doc.data()    
            }
            return []
          })}).catch(err=>console.log('in<><>',err))
        const studentDetails = await studentRef.doc(orderRes._uid).get().then(querySnapshot=>querySnapshot.data()).catch(err=>console.log('stu<><>',err))
        const options = { preferCSSPageSize:true  };
          let subtotal = 0;
          let totalPrice = 0;
          let time = orderRes.orderCreatedAt ? orderRes.orderCreatedAt.seconds ? new Date(((orderRes.orderCreatedAt.seconds + 19800) * 1000)).toDateString(): '' : ''
          const file = { 
            content: 
            `
            <!DOCTYPE html>
            <html lang="en">

            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />


              <!-- Invoice styling -->
              <style>
                body {
                  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                  text-align: center;
                  color: #777;
                }

                body h1 {
                  font-weight: 300;
                  margin-bottom: 0px;
                  padding-bottom: 0px;
                  color: #000;
                }

                body h3 {
                  font-weight: 300;
                  margin-top: 10px;
                  margin-bottom: 20px;
                  font-style: italic;
                  color: #555;
                }

                body a {
                  color: #06f;
                }

                .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #eee;
                  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
                  font-size: 16px;
                  line-height: 24px;
                  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                  color: #555;
                }

                .company_Add {
                  /* padding-left: 80px !important; */
                  font: 13px 'Helvetica';
                  line-height: 18px;
                  text-align: left;
                }
                .company_Add2 {
                  display: flex;
                }
                .company_Logo {
                  height: 40px;
                  margin: 10px 40px 0px 10px;
                }
                .tax_invoice {
                  font: bold 13px 'Helvetica';
                  color: #4f90bb;
                  line-height: 34px;
                }

                .tdPadding0 {
                  padding-bottom: 0px !important;
                  padding-top: 0px !important;
                }

                .font13 {
                  font-size: 13px;
                }

                .heading2 {
                  padding-top: 5px !important;
                  font-weight: bolder;
                  font-size: 13px;
                  color: #000;
                }

                .heading3 {
                  border-bottom: 1px solid #00000073;
                  border-top: 1px solid #00000073;
                  /* padding-top: 5px; */
                  font-size: 13px;
                  color: #000;
                  font-weight: bolder;
                  display: flex;
                  justify-content: space-between;
                  margin-bottom:12px;
                }

                .companyDiv {
                  display: flex;
                  justify-content: space-between;
                  font: 13px 'Helvetica';
                  line-height: 18px;
                  border-bottom: #4f90bb 2px solid;
                  margin-top: 20px;
                  padding-bottom: 30px;
                }

                .customer_Add {
                  font-size: 13px;
                  line-height: 18px;
                  text-align: left;
                  max-width: 280px;
                }

                strong {
                  color: #000;
                }

                .customerDiv {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 40px;
                }

                .date_Div {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 60px;
                  border-bottom: 1px solid #4f90bb;
                  background-color: #cde6f7;
                  padding: 10px;
                  font-size: 13px;
                  margin-top: 3px;
                  color: #509cd0;
                  font-weight: bold;
                }

                .alignLeft {
                  text-align: left !important;
                }

                .alignRight {
                  text-align: right !important;
                }

                .itemsContainer {
                  font-size: 13px;
                  display: flex;
                  border-bottom: 1px solid #00000073;
                  line-height: 18px;
                  align-items:center;

                
                }

                .itemsDetail {
                  // min-height:30px;
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                  margin-left: 60px;
                  line-height: 18px;
                  align-items:center;
                }

                .final_Div {
                  display: flex;
                  justify-content: space-between;
                  margin-top:10px;
                }

                .terms_Div {
                  margin-top: 10px;
                  text-align: left;
                  font-size: 13px;
                  line-height: 18px;

                }

                .total_Div {
                  display: flex;
                  justify-content: space-between;
                  width: 50%;
                  font-size: 13px;
                  border-bottom: 1px solid #00000073;
                  padding-bottom: 20px;
                }

                .total_Div_Name {
                  color: #4f90bb;
                  text-align: left;
                }

                .total_Due {
                  display: flex;
                  float: right;
                  width: 50%;
                  justify-content: space-between;
                  border-bottom: 1px solid #4f90bb;
                  color: #4f90bb;
                }

                .thankYou_div {
                  display: flex;
                  width: 100%;
                  justify-content: flex-end;
                  color: #4f90bb;
                  margin-top: 5px;
                  font-size: 13px;
                }
                .paid_span {
                  position: absolute;
                  top: 35%;
                  left: 44%;
                  z-index: -1;
                  transform: rotate(-55deg);
                  color: #00ce10;
                  font-size:55px;

                }
              </style>
            </head>

            <body>


              <div class="invoice-box">
                <span class="paid_span">PAID</span>
              
                  <div class="companyDiv">
                    <div class="company_Add">
                      <div class="company_Add2">
                        <img class="company_Logo" src="data:image/png;base64,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" alt="."/>
                        <div>
                          <strong>T N COLLEGE OF COMPETITIONS P. LTD</strong><br />
                          C-8/631 SECTOR 8 ROHINI<br />
                          DELHI, Delhi 110085 IN<br />
                          +91 9911374444<br />
                          admin@thetncollege.com<br />
                          www.thetncollege.com<br />
                          GSTIN: 07AACCT8729N1ZO<br />
                        </div>
                      </div>
                    </div>
                    <div>
                      <span class="tax_invoice">Receipt No- ${orderRes.invoiceNo ? orderRes.invoiceNo : 'N/A'}</span><br />
                    </div>
                  </div>
                  <div class="customerDiv">
                    <div class='customer_Add'>
                      <span>
                        <strong>BILL TO</strong><br />
                        ${studentDetails.firstname ? studentDetails.firstname : '' } ${studentDetails.lastname ? studentDetails.lastname : ''}<br />
                        Guardian's Name: ${studentDetails.fatherName ? studentDetails.fatherName : studentDetails.husbandName ? studentDetails.husbandName : ''}<br />
                        Mobile: ${studentDetails.mobile ? studentDetails.mobile : ''}<br/>
                        Address: <span>${studentDetails.address ? studentDetails.address: ''}</span><br />
                      </span>
                    </div>
                    <div>
                      <div class="date_Div">Date<br />
                        ${time}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="heading3">
                      <span><strong>NO</strong></span>
                      <span><strong>AMOUNT</strong></span>
                    </div>
                    ${boughtItems !== undefined && boughtItems.map((item, i) => {
                      if(item.price) {
                        subtotal = subtotal + ((item.price * 100)/118)
                        totalPrice = totalPrice + item.price
                      }
                      return `<div class="itemsContainer">
                          <span>${i+1}</span>
                          <div class="itemsDetail">
                            <span><strong>${item.title ? item.title : ''}</strong></span>
                            <span>${item.price ? ((item.price * 100)/118).toFixed(2) : ''}</span>
                          </div>
                        </div>`
                      })}  
                    <div class="final_Div">
                      <div class="terms_Div">
                        <span>Terms & Conditions:</span><br />
                        <span>1. Fees Once Paid is not refundable.</span><br />
                        <span>2. Fee is collected for Online Classes.</span><br />
                        <span>3. All disputes are under Delhi' Jurisdiction.</span><br />

                      </div>
                      <div class="total_Div">
                        <div class="total_Div_Name">
                          <span>SUBTOTAL</span><br />
                          <span>DISCOUNT</span><br />
                          <span>GST @18% </span><br />
                          <span>TOTAL</span><br />
                          <span>PAYMENT</span><br />
                        </div>
                        <div>
                          <span>${subtotal.toFixed(2)}</span><br />
                          <span>${orderRes.discountOf ? orderRes.discountOf.toFixed(2) : 0}</span><br />
                          <span>${orderRes.discountOf ? ((totalPrice - orderRes.discountOf) * 0.18).toFixed(2):((totalPrice) * 0.18).toFixed(2)}</span><br />
                          <span>${orderRes.discountOf ? ((((totalPrice - orderRes.discountOf)*100)/118)+((((totalPrice - orderRes.discountOf)*100)/118)*0.18)).toFixed(2):((((totalPrice)*100)/118)+((((totalPrice)*100)/118)*0.18)).toFixed(2)}</span><br />
                          <span>${orderRes.discountOf ? ((((totalPrice - orderRes.discountOf)*100)/118)+((((totalPrice - orderRes.discountOf)*100)/118)*0.18)).toFixed(2):((((totalPrice)*100)/118)+((((totalPrice)*100)/118)*0.18)).toFixed(2)}</span><br />

                        </div>
                      </div>
                    </div>
                    <div class="total_Due">
                      <p>TOTAL DUE</p>
                      <p>₹ 0.00</p>
                    </div>
                    <div class="thankYou_div">THANK YOU</div>
                  </div>
                
              </div>
            </body>

            </html>`
            };
        console.log('after<><><')
        console.log('<><',orderRes.orderCreatedAt.seconds )
        console.log('<1000><',new Date(orderRes.orderCreatedAt.seconds * 1000))
        return html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        console.log('pdf<><>',)
        invoiceRef.doc(orderRes.invoiceNo).set({invoiceNo: orderRes.invoiceNo, name:`${studentDetails.firstname ? studentDetails.firstname : '' } ${studentDetails.lastname ? studentDetails.lastname : ''}`, created_at: orderRes.orderCreatedAt, _uid: orderRes._uid, enrollmentNO: studentDetails.enrollmentNO ? studentDetails.enrollmentNO : 'N/A', invoiceFile:Buffer.from(pdfBuffer).toString('base64'), totalAmount: orderRes.discountOf ? ((subtotal/100 * 18 + subtotal) - orderRes.discountOf).toFixed(2) : (subtotal/100 * 18 + subtotal).toFixed(2)}).then(res=>console.log('saved')).catch(err=>console.log('invoces<>',err))
        const msg = {
          to: studentDetails.email,
          from: 'noreply@tncollege.online',
          subject: 'Your Receipt',
          text: `Your Receipt ${orderRes.invoiceNo ? orderRes.invoiceNo : 'N/A'}`,
          attachments: [
            {
              content: Buffer.from(pdfBuffer).toString('base64'),
              filename: "attachment.pdf",
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
        };
         sgMail.send(msg).catch(err => {
         
          return console.log(err);
        });
        response.json({ status: 'ok'});
        return
      }).catch(err=>console.log('err',err))
      }
      else {
        console.log('In else 2')
        response.json({ status: 'ok'});

      } 
    } else {
      response.json({ status: 'ok'});
      console.log('In else 1')
    }
    //   const orderRes = await ordersRef.doc('order_HCWjl3svr2cD7g').get()
    //   .then(querySnapshot => console.log(querySnapshot))
    
 
// } catch (error) {
//   response.send({error:error});
// }
return response.json({ status: 'ok'});
});

exports.addInvoiceToIndex = functions.firestore.document('invoices/{invoices}')
.onCreate(snapshot => {
  const data = snapshot.data();
  const objectID = snapshot.id;
  return invoiceIndex.saveObject({...data, objectID, id: objectID, invoiceFile: ''});
}) 


exports.emailLogin = functions.https.onCall(async (data, context) => {

  try {
    const email = data.email
    const stuRef = admin.firestore().collection("zSystemStudents")
    const primaryEmail = await stuRef.where('email', '==', email).get().then(querySnapshot=> querySnapshot.docs.map(doc => doc.data()))
    if( primaryEmail !== undefined && primaryEmail.length !== 0 ) {
      return {hasError: false, message: email}
    } 

    const secEmail = await stuRef.where('secondaryEmail', '==', email).get().then(querySnapshot=> querySnapshot.docs.map(doc => doc.data()))
    if( secEmail !== undefined && secEmail.length !== 0 ) {
      return {hasError: false, message: secEmail !== undefined ?secEmail[0] !== undefined ? secEmail[0].email : '' : ''}
    } 
    return { hasError: true, message: 'Email is not registered' }
  } catch (error) {
    return { hasError: true, message: error };
}
})


exports.failedTran = functions.https.onRequest(async (request, response) => {
  console.log('<fail>',request.body)
})

exports.updatePacakge = functions.firestore.document('zSystemStore/{zSystemStore}')
.onUpdate(async (change)=>{
  const newData = change.after.data();
  const itemID = change.after.id;
  console.log('<itemID>',itemID)
  if(newData.type === 'package'){
    const purchaseHistoryRef = admin.firestore().collection("purchaseHistory")
    const studentRef = admin.firestore().collection("zSystemStudents")
    const storeRef = admin.firestore().collection("zSystemStore")
    let purchaseData = await purchaseHistoryRef.where('itemID','==',itemID).get().then(query => query.docs.map(doc => doc.data()))
    if(purchaseData.length === 0){
      console.log('<no data>',purchaseData.length)
      return
    }
    purchaseData.forEach(async item=>{
      // console.log('map',item)
      let packageData = await storeRef.doc(item.itemID).get().then(doc => doc.data())
      if(packageData.book !== undefined && packageData.book.length !== 0){
        packageData.book.forEach(itemBook=>{
          studentRef.doc(item.userID).collection('boughtItem').doc(itemBook)
          .get().then(doc1=>{
            if(!doc1.exists){
              return studentRef.doc(item.userID).collection('boughtItem').doc(itemBook)    
              .set({
                type: 'book',
                itemID: itemBook,
                readingProgress: 0,
                createdAt: new Date(),
                addedAfterPurchase: true
              })
              .then(res => console.log("book added",itemBook))
              .catch(err => console.log(err))
            }
            return 0;
          }).catch(err => console.log(err))

        })
      }
      if(packageData.quiz !== undefined && packageData.quiz.length !== 0){
        packageData.quiz.forEach(itemQuiz => {
          studentRef.doc(item.userID).collection('boughtItem').doc(itemQuiz)
          .get().then(doc1=>{

            if(!doc1.exists){
              return studentRef.doc(item.userID).collection('boughtItem').doc(itemQuiz)
              .set({
                type: 'quiz',
                itemID: itemQuiz,
                createdAt: new Date(),
                addedAfterPurchase: true
              })
              .then(res=>console.log("quiz added", itemQuiz))
              .catch(err=>console.log(err))
            }
            return 0;
          }).catch(err => console.log(err))

        })
      }
    })
  }
})


exports.addStudyMaterial = functions.firestore.document('studyMaterial/{studyMaterial}')
.onCreate(async snapshot => {
  const data = snapshot.data();
  const itemID = snapshot.id;
  const stuRef = admin.firestore().collection("zSystemStudents")
  if(data.type === 'student') {
    let boughtItemRef = admin.firestore().collection("zSystemStudents").doc(itemID).collection('boughtItem')
    data.book.forEach(itemBook => {
      boughtItemRef.doc(itemBook).set({createdAt:new Date().valueOf(),itemID:itemBook,type:'book', addedbyAdmin:true},{merge:true})
    })
    data.quiz.forEach(itemQuiz => {
      boughtItemRef.doc(itemQuiz).set({createdAt:new Date().valueOf(),itemID:itemQuiz,type:'quiz', addedbyAdmin:true},{merge:true})
    })
  }
  if(data.type === 'batch') {
    let studentData = await stuRef.where('batch','array-contains',itemID).get().then(query=>query.docs.map(doc=>doc.data()))
    studentData.forEach(item => {
      let boughtItemRef = admin.firestore().collection("zSystemStudents").doc(item._uniqueID).collection('boughtItem')
      data.book.forEach(itemBook => {
        boughtItemRef.doc(itemBook).set({createdAt:new Date().valueOf(),itemID:itemBook,type:'book', addedbyAdmin:true},{merge:true})
      })
      data.quiz.forEach(itemQuiz => {
        boughtItemRef.doc(itemQuiz).set({createdAt:new Date().valueOf(),itemID:itemQuiz,type:'quiz', addedbyAdmin:true},{merge:true})
      })
    })
  }
})
exports.updateStudyMaterial = functions.firestore.document('studyMaterial/{studyMaterial}')
.onUpdate(async change => {
  
  const data = change.after.data();
  const itemID = change.after.id;
  // const data = snapshot.data();
  // const itemID = snapshot.id;
  const stuRef = admin.firestore().collection("zSystemStudents")
  if(data.type === 'batch') {
    let studentData = await stuRef.where('batch','array-contains',itemID).get().then(query=>query.docs.map(doc=>doc.data()))
    studentData.forEach(item=>{
      let boughtItemRef = admin.firestore().collection("zSystemStudents").doc(item._uniqueID).collection('boughtItem')
      data.book.forEach(itemBook => {
        boughtItemRef.doc(itemBook).set({createdAt:new Date().valueOf(),itemID:itemBook,type:'book', addedbyAdmin:true},{merge:true})
      })
      data.quiz.forEach(itemQuiz => {
        boughtItemRef.doc(itemQuiz).set({createdAt:new Date().valueOf(),itemID:itemQuiz,type:'quiz', addedbyAdmin:true},{merge:true})
      })
      data.deletedBooks.forEach(itemBook => {
        boughtItemRef.doc(itemBook).delete()
      })
      data.deletedQuizes.forEach(itemQuiz => {
        boughtItemRef.doc(itemQuiz).delete()
      })
    })
  }

  if(data.type === 'student') {
    let boughtItemRef = admin.firestore().collection("zSystemStudents").doc(itemID).collection('boughtItem')
    data.book.forEach(itemBook => {
      boughtItemRef.doc(itemBook).set({createdAt:new Date().valueOf(),itemID:itemBook,type:'book', addedbyAdmin:true},{merge:true})
    })
    data.quiz.forEach(itemQuiz => {
      boughtItemRef.doc(itemQuiz).set({createdAt:new Date().valueOf(),itemID:itemQuiz,type:'quiz', addedbyAdmin:true},{merge:true})
    })
    data.deletedBooks.forEach(itemBook => {
      boughtItemRef.doc(itemBook).delete()
    })
    data.deletedQuizes.forEach(itemQuiz => {
      boughtItemRef.doc(itemQuiz).delete()
    })
  }
})

exports.updateDiscountCouponsReq = functions.firestore.document('DiscountCoupons/{DiscountCoupons}')
.onUpdate(async change => {
  const data = change.after.data();
  const itemID = change.after.id;
  if(data.used === true){
    let requestRef = admin.firestore().collection("DocumentRequest")
    let requestDoc = await requestRef.where('couponCode', '==', data.couponCode).get().then(query => query.docs.map(doc => doc.data()))
    if(requestDoc.length !== 0){
      requestRef.doc(requestDoc[0].itemID).set({used:true},{merge:true})
    }
  }
  return
})



exports.addStudentUserTemp = functions.https.onCall((data, context) => {

    console.log('dataaaa', data)
    const { email, disabled, password, mobile} = data;
    return admin
      .auth()
      .createUser({
        email,
        disabled,
        password,
        emailVerified: false,
        phoneNumber: "+91" + mobile,
      })
      .then((res) => {
        let stuRef = admin.firestore().collection("zSystemStudents")
        stuRef.doc(res.uid).set({...data, _uniqueID:res.uid, createdAt:admin.firestore.FieldValue.serverTimestamp()})
        
        return email
        
      }).catch(err=>{
        return {hasError:true,msg:err}
      })
        
});

exports.deleteAllUsers = functions.https.onRequest(
  async (req, res)=> {
    const allUsers = await admin.auth().listUsers();
    const allUsersUID = allUsers.users.map((user) => user.uid);
    return admin.auth().deleteUsers(allUsersUID).then(() => res.send("deleted"));
  }
);


exports.onSpecialCoupon = functions.firestore.document('DiscountCoupons/{docId}')
.onCreate((snap, context) => {
  const newValue = snap.data();
  if(newValue.type === 'Special') {
    const stuRef = admin.firestore().collection("zSystemStudents")
    console.log('<><',newValue.couponFor)
    if(newValue.couponFor){

        return stuRef.doc(newValue.couponFor.stuID).get().then(query=>{
          let email = query.data().email
          let config = sendGridConfig(email, 'noreply@tncollege.online', `Your Discount Coupon`, `
          <html> 
          <body>
          <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
              <img src="data:image/png;base64,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
              CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
              </br>
              <p>Hello,</p>
              <p>Discount coupon is created for you.</p>
              <p>Your coupon code is :- ${newValue.couponCode}.</p>
              <br/>
              <br/>
              <p>Regards<br/>
              TN College</p>
          </div>
          </body>
          </html>
      `)
          return axios(config)
          .then((response) => console.log('Success! Mail sent.'))
          .catch((error) => console.log(error));
        }).catch((error) => console.log(error));
    }
  }
  return 0;
})

exports.onCouponApprove = functions.firestore.document('DocumentRequest/{ID}')
.onUpdate((change)=>{
  const newData = change.after.data();
  if(newData.status === 'Approved' && !newData.used){
    const stuRef = admin.firestore().collection("zSystemStudents")

    return stuRef.doc(newData.studentId).get().then(query=>{
      let email = query.data().email
      let config = sendGridConfig(email, 'noreply@tncollege.online', `Your Discount Coupon`, `
      <html> 
      <body>
      <div style="padding: 20px;background: #fff;height: 80%;width: 100%;margin: 20px;">
          <img src="data:image/png;base64,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
          CahCBDl7MAAAAASUVORK5CYII=" style=" height: 115px;">
          </br>
          <p>Hello,</p>
          <p>Your discount coupon request has been approved.</p>
          <p>Your coupon code is :- ${newData.couponCode}.</p>
          <br/>
          <br/>
          <p>Regards<br/>
          TN College</p>
      </div>
      </body>
      </html>
      `)
      return axios(config)
      .then((response) => console.log('Success! Mail sent.'))
      .catch((error) => console.log(error));
    }).catch((error) => console.log(error));

  }
  return 0;
})

exports.deleteCollection = functions.https.onCall((data, context) => {
  let { path } = data
  var batch = admin.firestore().batch()

  admin.firestore().collection(path).listDocuments().then(val => {
    val.map((val) => {
       return batch.delete(val)
    })
     batch.commit()
    return 0;
  }).catch(err=>console.log(err))
  
})

exports.deleteCartItem = functions.https.onCall((data, context) => {
  let { items } = data
  const currentUid = context.auth.uid


  // const deleteItem = async (itemId) => {
  //   console.log('IN Delete',itemId)
  //   let cartRef = admin.firestore().collection('zSystemStudents').doc(currentUid).collection('cart').doc(itemId)
  //   cartRef.delete().then(res=>console.log('Deleted')).catch(err=>console.log('catch2',err))
    
  // }
  

  // var jobskill_ref = admin.firestore().collectionGroup('cart').where('itemID','==',item);
  // let batch = firestore.batch();

  // jobskill_ref
  //   .get()
  //   .then(snapshot => {
  //     snapshot.docs.forEach(doc => {
  //       batch.delete(doc.ref);
  //     });
  //     return batch.commit();
  //   })

  let docRef = admin.firestore().collection('zSystemStore')
  items.forEach(async item=>{
    console.log('each',item)
    await docRef.doc(item).get().then(doc=>{
      console.log('doc',doc.exists)
      if(!doc.exists){
        let cartRef = admin.firestore().collection('zSystemStudents').doc(currentUid).collection('cart').doc(item)
        return cartRef.delete().then(res=>console.log('Deleted')).catch(err=>console.log('catch2',err))
       
      }
      else return console.log('in else')
    }).catch(err=>console.log('catch',err))

  })
});

exports.getQuestionsV2 = functions.https.onRequest(async (req, res) => {
  try {
    const { subject, topic, questionLanguage } = req.query;

    // Initialize Firestore query
    let query = admin.firestore().collection("QuestionV2");

    // Apply filters if they exist
    if (subject) {
      query = query.where("subject", "==", subject);
    }
    if (topic) {
      query = query.where("topic", "==", topic);
    }

    // Execute the query
    const snapshot = await query.get();

    // Check if there are no matching documents
    if (snapshot.empty) {
      return res.status(404).json({ message: "No questions found" });
    }

    // Filter by questionLanguage if provided
    const questions = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) =>
        questionLanguage
          ? doc.questionLanguage.includes(questionLanguage)
          : true
      );

    // Check if any documents remain after filtering by questionLanguage
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions match the filters" });
    }

    // Respond with the filtered questions
   return res.status(200).json({
      message: "Questions retrieved successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
   return res.status(500).json({ error: "Failed to fetch questions" });
  }
});

exports.getSubjects = functions.https.onRequest(async (req, res) => {
  try {
    // Fetch documents from the Subjects collection where type is "subject"
    const snapshot = await admin.firestore()
      .collection("subjects")
      // .where("type", "==", "subject")
      .get();

    // Check if there are no documents
    if (snapshot.empty) {
      return res.status(404).json({ message: "No subjects found" });
    }

    // Map documents into an array
    const subjects = snapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Include document data
    }));

    // Respond with the subjects
    res.status(200).json({
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

