# <img title="Slack Symbol" src="Symbols/slackIcon.png" width="27"> Slack-Status Widget for Scriptable

<!-- [![](https://img.shields.io/badge/author-@whothefuckishrb-blue.svg?style=flat&logo=twitter)](https://twitter.com/whothefuckishrb) -->
![](https://img.shields.io/badge/dynamic/json?color=purple&label=Script%20Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2Fslack-status%2Fmain%2Fslack-status-widget.json)

Script which displays the current Slack Status via API as [Scriptable](https://scriptable.app "Homepage") Widget.    
This is the missing widget for all power users of slack.

<!--
TL;DR: Download it [here](https://iamrbn.github.io/slack-status/Status%20Slack%20Widget.scriptable) fast as possible.
https://fifithebulldog.github.io/scriptable-testflight-watcher/TestFlight%20Watcher.scriptable
-->

<!-- <kbd> -->
<img title="SlackBot" src="Symbols/slackBot.png" width="77"> <img title="Scriptable App Icon" src="https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/92/2c/8d/922c8d5d-9e5b-207b-98fd-95d3387c8387/source/77x77bb.png" width="77">
<!-- </kbd> -->

<details>
  <summary><b>1.5 Update Notes (xx.11.2024)</b></summary>
  
- Added Update Widget
- improved No Connection Widget
- Small code improvements
</details>

<details>
  <summary><b>1.2.1 Update Notes (19.07.2022)</b></summary>
  
- Fixed a problem where the widget displays an error when an open update is pending. Now it should work correctly again.
</details>

<details>
  <summary><b>1.2 Update Notes (16.07.2022)</b></summary>
  
- Added push notifications for slack status [Beta]
- Improved the error/bad-connection widget
- Improved/thinned out some parts of the script - saved 70 lines of code
</details>

<details>
  <summary><b>1.1pdate Notes (24.05.2022)</b></summary>
  
  - Added selfupdate function[^1]
  - Script thinned out in various places
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

<img src="Images/runsInApp.png" width="300">

<br>

### Bad/No Internet Connection & Update Available

When the script cannot connect to the Slack API it will shown the Error Widget.

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

It will Downloads and Save the Following Symbols at the directory "slack-status-widget"

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


<a href="https://reddit.com/user/iamrbn">
<img title="Follow Me On Reddit @iamrbn" src="Images/Badges/reddit_black_iamrbn.png" width="130">
</a>

<a href="https://twitter.com/iamrbn_">
<img title="Follow Me On Twitter @iamrbn_" src="Images/Badges/twitter_black.png" width="137">
</a>

<a href="https://mastodon.social/@iamrbn">
<img title="Follow Me On Mastodon @iamrbn@mastodon.social" src="Images/Badges/mastodon_black.png" width="170">
</a>



[^1]:[Function](https://github.com/mvan231/Scriptable#updater-mechanism-code-example "GitHub Repo") is written by the amazing [@mvan231](https://twitter.com/mvan231 "Twitter")
