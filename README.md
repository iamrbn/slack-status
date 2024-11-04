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

**1.2.1 Update Notes** (19.07.2022)
- Fixed a problem where the widget displays an error when an open update is pending. Now it should work correctly again.

**1.2 Update Notes** (16.07.2022)
- Added push notifications for slack status [Beta]
- Improved the error/bad-connection widget
- Improved/thinned out some parts of the script - saved 70 lines of code

**1.1 Update Notes** (24.05.2022)
- Added selfupdate function[^1]
- Script thinned out in various places

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

### Refresh Intervall

you can set it at every widget via widget parameter

<img title="" src="Images/editWidgetParameter.png" width="300">

<br>

### Run Script in App

By running the scirpt **In App** it will present a menu
It's including the current Slack Status in top

<img src="Images/runsInApp.png" width="300">

<br>

### Error / Bad Internet Connection

When the script cannot connect to the Slack API it will shown the Error Widget.

<img title="Error/Bad Connection - Medium Widget" src="Images/errorWidgetMedium.png" width="350">

<br>

### Push Notifications ` [Beta] `

You'll get push-notifications if the status of slack changes.

```javascript
const getStatusNotifications = true;
```
<img src="Images/getOKNotification.png" width="450">
<img src="Images/getIssueNotification.PNG" width="450">

<br>

## ⚙️ SETUP

### Set Refresh Intervall

1. Long tab the individual widget an chose `Edit "Scriptable"` or `Edit Widget`
2. set a number for the update intervall (_in minutes_) into the widget Parameter
3. finish - the script runs every `X` minutes yet.

**If it's not filled the script runs every 30 minutes!**

## ⬇️ INSTALL SCRIPT / WIDGET

### Install Script
1. Install [Scriptable for iOS `↗`](https://apps.apple.com/us/app/scriptable/id1405459188?ign-mpt=uo%3D4 "App Store")
2. Copy **each line** of the [Script `↗`](https://raw.githubusercontent.com/whothefuckishrb/slack-status/main/slack-status-widget.js)
or download [this](https://www.icloud.com/shortcuts/a1947fcd8071484ea157c19e68ded9d4) iOS helper shortcut <!-- or Download [this](https://raw.githubusercontent.com/whothefuckishrb/slack-status/main/Status%20Slack%20Widget.scriptable) scriptable-File -->
3. `+` Add new Script

<img title="" src="Images/addNewScript.png" width="250">

4. Paste into the new Script
5. Finish

___

### Add Widget to Homescreen
1. Go to your homescreen and long tab anywhere
2. By tapping the `+` it will opens the gallery
3. chose or search for scriptable
4. Chose the widget-size and tap `"Add Widget"`
5. Tap the widget and choose the script, then set `"When Interacting" = "Run Script"` 
6. Finish

___

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
