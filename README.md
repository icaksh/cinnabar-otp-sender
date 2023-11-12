# Cinnabar OTP (One-Time Password Sender)

I've crafted a secure and free One-Time Password (OTP) Sender using NodeJS, Express, and TypeScript.

**IMPORTANT: PLEASE REFRAIN FROM USING THIS APPLICATION FOR SPAMMING PURPOSES!**

## Key Features

- WA
- Telegram (Upcoming)

## Upcoming Improvements

- Database Migration (due to transitioning to v7.0/alpha)
- Integration for Telegram

## Configuration Settings

### Example

```sh
# APPLICATION CONFIGURATION
PRIVATE_API_KEY="api-key"
NAME="member" # WA Client Name
SESSION="session" # WA Session Name
PORT=3000

# LOGIN PAGE
AUTH_NAME=admin # Login Page Auth Name
AUTH_PASSWORD=admin # Login Page Auth Password

# DATABASE
DB_NAME=db
DB_USER=root
DB_HOST=localhost
DB_DRIVER=mysql
DB_PASSWORD=root

# OTP SETTINGS
FIRST_STATEMENT='Your OTP code for access is'
LAST_STATEMENT='Ensure to keep your code confidential!'
OTP_LIFETIME=2 # OTP lifetime, in minutes
OTP_MAX_ATTEMPTS=3 # Maximum attempts allowed for OTP verification
```

|Setting | Required | Description|
|-------------|----------|------------|
|`PRIVATE_API_KEY`| yes | Your API key for enhanced security
|`NAME`| yes | Client name
|`SESSION` | yes | Session name, used for authentication 
|`OTP_LIFETIME` |yes | OTP lifetime, in minutes
|`OTP_MAX_ATTEMPTS` |yes | Maximum attempts allowed for users entering an incorrect `otpCode`

## User Authentication
`GET /auth/`

![Login Page](assets/1.png)
![Login Page](assets/2.png)

### Authentication Credentials

|Field | Required | Description|
|-------------|----------|------------|
|`username`| yes | `process.env.AUTH_NAME`
|`password`| yes | `process.env.AUTH_PASSWORD`
|`session` | yes | `process.env.SESSION`

> Note: If login fails, refresh the page to get a new QR code and scan it promptly!

## API Routes

### Request OTP
`POST /otp/`

#### Request Header
`API-Key` is required. Retrieve it from `PRIVATE_API_KEY` in your `.env` file.

#### Request Body
A JSON-encoded object for the OTP. The `phoneNumber` is mandatory, and `reservable_ports` must be included if the type is tcp.

|Field | Type | Required | Description|
|-------------|------|----------|------------|
|`phoneNumber`| number| yes | Receiver's phone number (use country code without **+**)

#### Example Request

```bash
curl -vvv -H "API-Key: api-key" http://example.com/otp/ -X POST -d '{"phoneNumber": 6281212341234}'
```

#### Response
  Expected Status `201 Created`

#### Response Body
A JSON-encoded object for the updated `Router Group`.

|Field       | Type   | Description |
|--------------------|--------|-------------|
| `id`             | number | ID
| `otpCode`             | number | OTP Code
| `phoneNumber`             | number | Receiver's phone number (use country code without **+**)
| `attempt` | number | Last attempts to verify the OTP
| `isUsed` | boolean | Indicates if the OTP Code has been used
| `createdAt` | datetime | Date OTP was created
| `updatedAt` | datetime | Date OTP was used

#### Example Response:
```json
{
    "id": 7,
    "otpCode": 354101,
    "phoneNumber": 6281212341234,
    "attempt": 0,
    "isUsed": false,
    "createdAt": "2023-11-11T16:46:07.000Z",
    "updatedAt": "2023-11-11T16:46:07.000Z"
}
```

### Retrieve OTP by Phone Number
`GET /otp/`

#### Request Header
`API-Key` is required. Retrieve it from `PRIVATE_API_KEY` in your `.env` file.

#### Request Query
A JSON-encoded object for the OTP. The `phoneNumber` must be included.

|Field | Type | Required | Description|
|-------------|------|----------|------------|
|`phoneNumber`| number| yes | Receiver's phone number (use country code without **+**)

#### Example Request

```bash
curl -vvv -H "API-Key: api-key" http://example.com/otp/?phoneNumber=6281212341234
```

#### Response
Expected Status `200 OK`

#### Response Body
A JSON-encoded object.

|Field       | Type   | Description |
|--------------------|--------|-------------|
| `otp`             | object | Requested OTP

#### Example Response:

```json
{
    "otp": {
        "id": 8,
        "otpCode": 549783,
        "phoneNumber": 6281212341234,
        "attempt": 0,
        "isUsed": false,
        "createdAt": "2023-11-11T16:51:06.000Z",
        "updatedAt": "2023-11-11T16:51:06.000Z"
    }
}
```

### Resend OTP
`POST /otp/resend`

#### Request Header
`API-Key` is required. Retrieve it from `PRIVATE_API_KEY` in your `.env` file.

#### Request Body
A JSON-encoded object for the OTP. The `phoneNumber` must be included.

|Field | Type | Required | Description|
|-------------|------|----------|------------|
|`phoneNumber`| number| yes | Receiver's phone number (use country code without **+**)

#### Example Request

```bash
curl -vvv -H "API-Key: api-key" http://example.com/otp/resend -X POST -d '{"phoneNumber": 6281212341234}'
```

#### Response
  Expected Status `202 Accepted`

#### Response Body
A JSON-encoded object.

|Field       | Type   | Description |
|--------------------|--------|-------------|
| `message`             | string | Response message from API
| `info`             | object | Response Body for OTP Request

#### Example Response:

```json
{
    "message": "success resending otp code",
    "info": {
        "id": 9,
        "otpCode": 809560,
        "phoneNumber": 628112341234,
        "attempt": 0,
        "isUsed": false,
        "createdAt": "2023-11-11T16:55:11.000Z",
        "updatedAt": "2023-11-11T16:55:11.000Z"
    }
}
```

### Verify OTP
`PUT /otp/`

#### Request Header
`API-Key` is required. Retrieve it from `PRIVATE_API_KEY` in your `.env` file.

#### Request Body
A JSON-encoded object for the OTP. Both `phoneNumber` and `otpCode` must be included.

|Field | Type | Required | Description|
|-------------|------|----------|------------|
|`

phoneNumber`| number| yes | Receiver's phone number (use country code without **+**)
|`otpCode`| number| yes | OTP Code

#### Example Request

```bash
curl -vvv -H "API-Key: api-key" http://example.com/otp/ -X PUT -d '{"phoneNumber": 628121234123, "otpCode":28374}'
```

#### Response
Expected Status `200 OK`

#### Response Body
A JSON-encoded object.

|Field       | Type   | Description |
|--------------------|--------|-------------|
| `message`             | string | Response message from API
| `info`             | object | Response Body for OTP Request

#### Example Response:

```json
{
    "message": "verification success",
    "info": {
        "id": 10,
        "otpCode": 137764,
        "phoneNumber": 6281212341234,
        "attempt": 0,
        "isUsed": false,
        "createdAt": "2023-11-11T16:58:52.000Z",
        "updatedAt": "2023-11-11T16:58:52.000Z"
    }
}
```

### Send Message
`POST /message/`

#### Request Header
`API-Key` is required. Retrieve it from `PRIVATE_API_KEY` in your `.env` file.

#### Request Body
A JSON-encoded object for the OTP. Both `phoneNumber` and `message` must be included.

|Field | Type | Required | Description|
|-------------|------|----------|------------|
|`phoneNumber`| number| yes | Receiver's phone number (use country code without **+**)
|`message`| string | yes | Message to send

#### Example Request

```bash
curl -vvv -H "API-Key: api-key" http://example.com/message/ -X POST -d '{"phoneNumber": 628121234123, "message":"abv"}'
```

#### Response
Expected Status `200 OK`

#### Response Body
A JSON-encoded object.

|Field       | Type   | Description |
|--------------------|--------|-------------|
| `message`             | string | Response message from API
| `info`             | object | Request Body

#### Example Response:

```json
{
    "message": "success sending message",
    "info": {
        "phoneNumber": 6281212341234,
        "message": "abc"
    }
}
```

## License
© 2023 Palguno Wicaksono

The copyright holders grant permission to copy, modify, convey, adapt, and redistribute this work under the terms of the GNU General Public License v3.0.
A copy of that license is available at [`LICENSE`](https://github.com/icaksh/cinnabar-otp-sender/blob/master/LICENSE)