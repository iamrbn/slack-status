# <img title="Slack Icon" src="Symbols/slackIcon.png" width="27"> Slack-Status Widget for Scriptable

![](https://img.shields.io/badge/dynamic/json?color=purple&label=Script%20Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2Fslack-status%2Fmain%2Fslack-status-widget.json)

Script which displays the current Slack Status via API as [Scriptable](https://scriptable.app "Homepage") Widget.    
This is the missing widget for all power users of slack.

<details open>
  <summary><b>1.5</b> Update Notes (29.11.2024)</summary>
  
- Added update widget for lock- & homescreen
- Improved 'No Connection' widget
- Improved UI of the medium sized widget
- Small code improvements _(module & script)_
</details>

<details>
  <summary>Older Updates</summary>
    <details>
      <summary><b>1.41</b> Update Notes (30.10.2024)</summary>
  
  - Fixes a bug that triggers an error after changing the API content
  </details>

<details>
  <summary><b>1.4</b> Update Notes (29.10.2024)</summary>
  
  - Parts of the script have been moved to a module for performance improvements
  - General script improvements
</details>

<details>
  <summary><b>1.3</b> Update Notes (28.05.2024)</summary>
  
  - Added rectangular lockscreen widget, styled like the medium one
  - Some services have been renamed by slack in the front- & backend
  - Some services have been also been added
  - The large widget has been adapted accordingly
  - Removed widget selection at the in-app dialogue - Now only the 'Web-Dashboard' is displayed
</details>

<details>
  <summary><b>1.2.1</b> Update Notes (19.07.2022)</summary>
  
- Fixed a problem where the widget displays an error when an open update is pending. Now it should work correctly again.
</details>

<details>
  <summary><b>1.2</b> Update Notes (16.07.2022)</summary>
  
- Added push notifications for slack status [Beta]
- Improved the error/bad-connection widget
- Improved/thinned out some parts of the script - saved 70 lines of code
</details>

<details>
  <summary><b>1.1</b> Update Notes (24.05.2022)</summary>
  
  - Added selfupdate function[^1]
  - Script thinned out in various places
</details>

</details>

## ✨ FEATURES

### Clickable Elements

<img title="header" src="Images/header.png">

<br>

<!-- ### Widget Specifications

Supports all sizes (_small, medium & large_)

<img title="Small Widget" src="Images/small_light_ok.PNG" width="140"> 

<img title="Medium Widget" src="Images/medium_light_ok.PNG" width="300"> 
<img title="Large Widget" src="Images/large_light_ok.PNG" width="300">

___ -->

### The Widgets have a **Dynamic Background** and is available in all sizes
<img title="" src="Images/dynamicBackground.png" width="500">

<br>

### Run Script in App
By running the scirpt **In App** it will present the online dashboard of the current slack status

<br>

### Bad/No Internet Connection & Update Available
If the script does not receive a response from the Slack API, it will be displayed in the widget.    
It also shows if there is an script update available.    
<img title="No Response Widget" src="Images/errorWidgetMedium.png" width="400"> <img title="Update Widget" src="Images/updateWidgetMedium.png" width="380">    
<img title="Lockscreen Widgets" src="Images/mockupLockscreenIssueWidgets.png" width="750">

<br>

### Notifications of Status

<img src="Images/getOKNotification.png" width="450"> <img src="Images/getIssueNotification.PNG" width="450">

<br>

## ⚙️ SETUP

```javascript
const getStatusNotifications = true //Set to false if you dont wanna get notifications!
const refreshInt = 60 //in minutes
```

### On First Run

<img title="Slack Icon" src="Symbols/slackIcon.png" width="35" align="center"> <img title="Sad SlackBot - Bad Connection" src="Symbols/sadSlackBot-badConnection.png" width="35" align="center"> <img title="OK" src="Symbols/ok.png" width="50" align="center"> <img title="Incident" src="Symbols/incident.png" width="50" align="center"> <img title="Notice" src="Symbols/notice.png" width="50" align="center"> <img title="Outabe" src="Symbols/outage.png" width="50" align="center"> <img title="Maintenance" src="Symbols/maintenance.png" width="50" align="center">

```
iCloud Drive/
├─ Scriptable/
│  ├─ slack-status-widget/
│  │  ├─ slackIcon.png
│  │  ├─ sadSlackBot-badConnection.png
│  │  ├─ ok.png
│  │  ├─ incident.png
│  │  ├─ notice.png
│  │  ├─ outage.png
│  │  ├─ maintenance.png
```
___


<p align="center">
  <a href="https://reddit.com/user/iamrbn/">
    <img title="Follow Me On Reddit @iamrbn" src="https://github.com/iamrbn/slack-status/blob/5fef0d438bd47bb8524e1b65679c8153ec30e165/Images/Badges/reddit_black_iamrbn.png" width="150"/>
  </a>
   <a href="https://bsky.app/profile/iamrbn.bsky.social">
    <img title="Follow Me On Bluesky @iamrbn.bsky.social" src="https://github.com/iamrbn/slack-status/blob/main/Images/Badges/badge_bluesky.png" width="165"/>
  </a>
    </a>
  <a href="https://mastodon.social/@iamrbn">     
  <img title="Follow Me On Mastodon iamrbn@mail.de@mastodon.socail" src="https://github.com/iamrbn/slack-status/blob/1e67e1ea969b791a36ebb71142ec8719594e1e8d/Images/Badges/mastodon_black.png" width="190"/>   
  </a>
  <a href="https://twitter.com/iamrbn_/">
    <img title="Follow Me On Twitter @iamrbn_" src="https://github.com/iamrbn/slack-status/blob/ae62582b728c2e2ad8ea6a55cc7729cf71bfaeab/Images/Badges/twitter_black.png" width="155"/>
</p>



[^1]:[Function](https://github.com/mvan231/Scriptable#updater-mechanism-code-example "GitHub Repo") is written by the amazing [@mvan231](https://twitter.com/mvan231 "Twitter")
