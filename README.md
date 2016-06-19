# slack-zapper
Zaps your messages in a slack channel

## how to use it
1. clone this repo locally
2. `npm install`
3. Create a file called `keys.json` in the same folder as this repo. This file should contain the API keys and IDs needed for the slack api. See below for the expected contents of this file.
4. `node deleter-v2.js`
5. If you want to delete more than about 1000 messages, run step 4 again until all your messages are zapped.

The `keys.json` file should look like this:
```
{
  "token": "your-api-token-from-slack-here",
  "user": "your-user-id",
  "channel": "channel-id-where-you-want-to-zap-messages"
}
```
