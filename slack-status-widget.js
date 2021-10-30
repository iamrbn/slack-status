// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: hashtag;
// Script is written by whothefuckishrb - GitHub (hrb7 → Reddit / whothefuckishrb → Twitter)
// Script-URL = https://github.com/whothefuckishrb/slack-status

const bgColor = Color.dynamic(Color.white(), new Color('#481349'))
const txtColor = Color.dynamic(Color.black(), Color.white())
const newDate = new Date()
const dateFormatter = new DateFormatter()
const widgetSize = config.widgetFamily;
const fm = FileManager.iCloud()
const dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
if(!fm.fileExists(dir)) {
  fm.createDirectory(dir)
}

async function refreshAfter() {
let refreshInterval = await args.widgetParameter
if (refreshInterval == null) {
    refreshInterval = 30 //min
  }
 return refreshInterval
}

const apiURL = 'https://status.slack.com/api/v2.0.0/current'

// GET DATA FROM API
let req = new Request(apiURL)
let data = await req.loadJSON()

var emoji = " ✅ "
 if (data.status != 'ok') {
 this.dateCreated = data.date_created
 this.dateUpdated = data.date_updated
 this.dataID = data.active_incidents[0].id
 this.dateCreated2 = data.active_incidents[0].date_created
 this.dateUpdated2 = data.active_incidents[0].date_updated
 this.dataTitle = data.active_incidents[0].title
 this.dataType = data.active_incidents[0].type
 this.dataStatus = data.active_incidents[0].status
 this.dataURL = data.active_incidents[0].url
 this.dataServices = data.active_incidents[0].services
 this.dateCreatedBody = data.active_incidents[0].notes[0].date_created
 this.dataBody = data.active_incidents[0].notes[0].body
  
    if (dataType == "incident") {
       emoji = " ⚠️ "
     } else if (dataType == "outage") {
       emoji = " ⛔️ "
     } else if (dataType == "notice") {
       emoji = " 🚩 "
     } else if (dataType == "maintenance") {
       emoji = " 🔧 "
     }
  }
  
// LOADING AND SAVING IMAGES FROM URL TO FOLDER
const imgURL = 'https://raw.githubusercontent.com/whothefuckishrb/slack-status/main/Symbols/'
async function saveImages() {
  console.log("loading & saving images")
  var imgs = ["Slack_Icon", "OK", "Incident", "Outage", "Notice", "Maintenance"]
  for(img of imgs) {
    let img_path = fm.joinPath(dir, img + ".png");
      if(!fm.fileExists(img_path)) {
      console.log("Loading image: " + img + ".png")
      let request = new Request(imgURL + img + ".png");
      image = await request.loadImage();
      fm.writeImage(img_path, image);
    }
  }
}

async function getImageFor(name) {
  let img_path = fm.joinPath(dir, name + ".png")
  await fm.downloadFileFromiCloud(img_path)
  img = await fm.readImage(img_path)
  return img
}

// ############ SETUP SMALL WIDGET ############
  async function createSmallWidget(refreshInterval) {
  const widget = new ListWidget()
  widget.backgroundColor = bgColor
  widget.setPadding(5, 1, 3, 1)
  var refreshDate = Date.now() + 1000*60*refreshInterval
  widget.refreshAfterDate = new Date(refreshDate)
  
  let titleStack = widget.addStack();
  titleStack.topAlignContent()
  
  titleStack.addSpacer(7)

  var img = await getImageFor("Slack_Icon");
  const AppIcon = titleStack.addImage(img);
  AppIcon.imageSize = new Size(20, 20)
  
  titleStack.addSpacer(7)

  const title = titleStack.addText("Slack Status");
  title.font = new Font("Futura-Medium", 17)

  widget.addSpacer(5)

  let statusImageStack = widget.addStack()
  statusImageStack.centerAlignContent()
  statusImageStack.setPadding(0, 37, 0, 0)
 
  if (data.status == 'ok') {
      widget.url = 'https://status.slack.com'
      StatusImage = statusImageStack.addImage(await getImageFor("OK"))
      StatusImage.imageSize = new Size(77, 77)
      statusTitle = widget.addText("is up and running 🚀")
      widget.addSpacer(5)
      statusTitle.font = Font.lightSystemFont(12)
      statusTitle.centerAlignText()
      widget.addSpacer(5)
      
} else {
      widget.url = 'https://status.slack.com'
      if (dataType == "incident") {
      StatusImage = statusImageStack.addImage(await getImageFor("Incident"))
    } else if (dataType == "outage") {
      StatusImage = statusImageStack.addImage(await getImageFor("Outage"))
    } else if (dataType == "notice") {
      StatusImage = statusImageStack.addImage(await getImageFor("Notice"))
    } else if (dataType == "maintenance") {
      StatusImage = statusImageStack.addImage(await getImageFor("Maintenance"))
    }

      StatusImage.imageSize = new Size(77, 77)
      StatusImage.centerAlignImage
  
      headline = widget.addText("Trouble with")
      headline.textColor = Color.red()
      headline.font = Font.semiboldSystemFont(11)
      headline.centerAlignText()
      
      let replaceServices = ("" + dataServices).replace(" ", "\n")
      
      statusTitle = widget.addText("" + replaceServices)
      statusTitle.textColor = Color.red()
      statusTitle.font = Font.semiboldSystemFont(12)  
      statusTitle.lineLimit = 3
      statusTitle.minimumScaleFactor = 0.8
      statusTitle.centerAlignText()

      
      widget.addSpacer(5);
}

  dateFormatter.useShortTimeStyle()
  const footer = widget.addText("Last Refresh " + dateFormatter.string(newDate))  
  footer.font = Font.mediumSystemFont(9);
  footer.textOpacity = 0.16
  footer.centerAlignText()

return widget;
}


// ########### SETUP MEDIUM WIDGET ###########
async function createMediumWidget(refreshInterval){
  const widget = new ListWidget()
  widget.setPadding(10, 10, 5, 10)
  widget.backgroundColor = bgColor
  var refreshDate = Date.now() + 1000*60*refreshInterval
  widget.refreshAfterDate = new Date(refreshDate)

  const titleStack = widget.addStack();

titleStack.addSpacer(2)

  var img = await getImageFor("Slack_Icon");
  let AppIcon = titleStack.addImage(img);
  AppIcon.imageSize = new Size(22, 22);
  AppIcon.url = "slack://"
  
titleStack.addSpacer(7)
  
  const t1 = titleStack.addText("Slack Status api")
  t1.font = new Font("Futura-Medium", 19)
  t1.url = "slack://"
  
widget.addSpacer()
  
// content of the widget
  const mainStack = widget.addStack()
  
// Left stack contains the status text
  const leftStack = mainStack.addStack();
  leftStack.layoutVertically();
  
// Right stack contains the status icon
  const rightStack = mainStack.addStack();
  rightStack.layoutVertically();
  
if (data.status == 'ok') {
  rightStack.setPadding(0, 30, 15, 0)
  leftStack.setPadding(0, 10, 0, 0)

leftStack.addSpacer(25)

  statusTitle = leftStack.addText("Slack is up and running 🚀")
  statusTitle.font = Font.lightSystemFont(14)
  
leftStack.addSpacer(7)

  let linkSymbol = SFSymbol.named("safari")
  let linkStack = leftStack.addStack()
  linkStack.centerAlignContent()
  linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues"
  
  let linkElement = linkStack.addText("Having trouble? ")
  linkElement.textColor = Color.gray()
  linkElement.font = Font.lightSystemFont(11)
  linkElement.textOpacity = 0.4
  
  let linkSymbolElement = linkStack.addImage(linkSymbol.image)
  linkSymbolElement.imageSize = new Size(12, 12)
  linkSymbolElement.tintColor = Color.gray()
  linkSymbolElement.imageOpacity = 0.2
  
  StatusImage = rightStack.addImage(await getImageFor("OK"))
  StatusImage.url = 'https://status.slack.com'

} else {
  if (dataType == "incident") {
        StatusImage = rightStack.addImage(await getImageFor("Incident"))
      } else if (dataType == "outage") {
        StatusImage = rightStack.addImage(await getImageFor("Outage"))
      } else if (dataType == "notice") {
        StatusImage = rightStack.addImage(await getImageFor("Notice"))
      } else if (dataType == "maintenance") {
        StatusImage = rightStack.addImage(await getImageFor("Maintenance"))
      }  
  StatusImage.url = dataURL
  leftStack.setPadding(0, 5, 0, 0)
  rightStack.setPadding(0, 5, 5, 0)
  
widget.addSpacer(7)

  apiTitle = leftStack.addText(dataTitle)
  apiTitle.font = Font.boldSystemFont(12);
  apiTitle.textColor = Color.red()
  apiTitle.lineLimit = 2
  apiTitle.minimumScaleFactor = 0.5
  
leftStack.addSpacer(3)
  
  apiBody = leftStack.addText(dataBody)
  apiBody.font = Font.lightSystemFont(12);
  apiBody.minimumScaleFactor = 0.6
  apiBody.textColor = Color.red()
  
leftStack.addSpacer(3)
 
  let linkSymbol = SFSymbol.named("info.circle")
  let linkStack = leftStack.addStack()
  linkStack.centerAlignContent()
  linkStack.url = dataURL
  
  let linkElement = linkStack.addText("Read more about " + dataType + " ID " + dataID)
  linkElement.textColor = Color.blue()
  linkElement.font = new Font("PingFangTC-Thin", 10)
  
linkStack.addSpacer(5)
  
  let linkSymbolElement = linkStack.addImage(linkSymbol.image)
  linkSymbolElement.imageSize = new Size(11, 11)
  linkSymbolElement.tintColor = Color.blue()
  
}

  // set the footer with the latest widget update
  dateFormatter.useShortDateStyle();
  dateFormatter.useShortTimeStyle();
  
  const footer = widget.addText("Last Widget Refresh " + dateFormatter.string(newDate));
  footer.font = Font.mediumSystemFont(9);
  footer.textOpacity = 0.16
  footer.centerAlignText()
  
  return widget;
}


// ############ SETUP LARGE WIDGET ##############
async function createLargeWidget(refreshInterval){
  const widget = new ListWidget()
  widget.backgroundColor = bgColor
  widget.setPadding(10, 15, 5, 10)
  var refreshDate = Date.now() + 1000*60*refreshInterval
  widget.refreshAfterDate = new Date(refreshDate)
  
// header of the widget
  const titleStack = widget.addStack();

  var img = await getImageFor("Slack_Icon");
  let AppIcon = titleStack.addImage(img);
  AppIcon.imageSize = new Size(25, 25);
  AppIcon.url = "slack://"
  
titleStack.addSpacer(7)
  
  const t1 = titleStack.addText("Slack Status api")
  t1.font = new Font("Futura-Medium", 23)
  t1.url = "slack://"
  
widget.addSpacer()
  
// content of the widget
if (data.status == 'ok') {
  widget.addSpacer()
  StatusImage = widget.addImage(await getImageFor("OK"))
  
widget.addSpacer()

  StatusImage.centerAlignImage()
  StatusImage.imageSize = new Size(77, 77)
  StatusImage.url = 'https://status.slack.com'
  statusTitle = widget.addText("Slack is up and running 🚀")  
  statusTitle.font = new Font("Futura-Medium", 17)
  
widget.addSpacer(5)
  
  let linkSymbol = SFSymbol.named("safari")
  let linkStack = widget.addStack()
  linkStack.setPadding(0, 103, 0, 0)
  linkStack.centerAlignContent()
  linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues"
  
  let linkElement = linkStack.addText("Having trouble? ")
  linkElement.textColor = Color.gray()
  linkElement.font = Font.lightSystemFont(11)
  linkElement.textOpacity = 0.4
  
  let linkSymbolElement = linkStack.addImage(linkSymbol.image)
  linkSymbolElement.imageSize = new Size(12, 12)
  linkSymbolElement.tintColor = Color.gray()
  linkSymbolElement.imageOpacity = 0.2
  
  statusTitle.font = new Font("Futura-Medium", 17)
  statusTitle.centerAlignText()
  widget.addSpacer()

} else {
  if (dataType == "incident") {
        let StatusImage = widget.addImage(await getImageFor("Incident"))
        StatusImage.imageSize = new Size(77, 77)
        StatusImage.centerAlignImage()
        StatusImage.url = dataURL
      } else if (dataType == "outage") {
        let StatusImage = widget.addImage(await getImageFor("Outage"))
        StatusImage.imageSize = new Size(77, 77)
        StatusImage.centerAlignImage()
        StatusImage.url = dataURL
      } else if (dataType == "notice") {
        let StatusImage = widget.addImage(await getImageFor("Notice"))
        StatusImage.imageSize = new Size(77, 77)
        StatusImage.centerAlignImage()
        StatusImage.url = dataURL
      } else if (dataType == "maintenance") {
        let StatusImage = widget.addImage(await getImageFor("Maintenance"))
        StatusImage.imageSize = new Size(77, 77)
        StatusImage.centerAlignImage()
        StatusImage.url = dataURL
      }
  
  apiTitle = widget.addText(dataTitle)
  apiTitle.font = Font.semiboldSystemFont(14)
  apiTitle.minimumScaleFactor = 0.5
  apiTitle.textColor = Color.red()
  apiTitle.centerAlignText()
  apiTitle.lineLimit = 2
  
widget.addSpacer(3)
  
  apiBody = widget.addText(dataBody)
  apiBody.font = Font.lightSystemFont(10);
  apiBody.minimumScaleFactor = 0.7
  apiBody.textColor = Color.red()
  apiBody.centerAlignText()
 
  let linkSymbol = SFSymbol.named("info.circle")
  let linkStack = widget.addStack()
  linkStack.centerAlignContent()
  linkStack.setPadding(0, 50, 0, 0)
  linkStack.url = dataURL
  
  let linkElement = linkStack.addText("Read more about " + dataType + " ID " + dataID)
  linkElement.textColor = Color.blue()
  linkElement.font = Font.lightSystemFont(12)

linkStack.addSpacer(3)

  let linkSymbolElement = linkStack.addImage(linkSymbol.image)
  linkSymbolElement.imageSize = new Size(12, 12)
  linkSymbolElement.tintColor = Color.blue()
}

widget.addSpacer()
  
//List of the single Services
 const mainStack = widget.addStack()
  const leftStack = mainStack.addStack()
  leftStack.layoutVertically()
   const rightStack = mainStack.addStack()
   rightStack.layoutVertically()

  // ### Line Number 1 ###
  const line1 = widget.addStack()
  const loginStack = line1.addStack()
  const login = loginStack.addText('Login/SSO')
  login.font = Font.lightSystemFont(12)
  loginStack.addSpacer(54)
  if (data.status != 'ok' && dataServices.includes("Login/SSO")) {
     if (dataType == "incident") {
     statusIcon = loginStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = loginStack.addImage(await getImageFor("Outage"))
   } else if (dataTypee == "notice") {
     statusIcon = loginStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = loginStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = loginStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
  loginStack.addSpacer()

  const ConnectionsStack = line1.addStack()
  const Connections = ConnectionsStack.addText('Connections')
  Connections.font = Font.lightSystemFont(12)
  ConnectionsStack.addSpacer(48)
  if (data.status != 'ok' && dataServices.includes("Connections")) {
     if (dataType == "incident") {
     statusIcon = ConnectionsStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = ConnectionsStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = ConnectionsStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = ConnectionsStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = ConnectionsStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
ConnectionsStack.addSpacer() 
  
  // ### Line Number 2 ###
  const line2 = widget.addStack()
  const MessagingStack = line2.addStack()
  const Messaging = MessagingStack.addText('Messaging')
  Messaging.font = Font.lightSystemFont(12)
  MessagingStack.addSpacer(52) 
  if (data.status != 'ok' && dataServices.includes("Messaging")) {
     if (dataType == "incident") {
     statusIcon = MessagingStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = MessagingStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = MessagingStack.addImage(await getImageFor("Notice"))
   } else if (dataTypee == "maintenance") {
     statusIcon = MessagingStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = MessagingStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
  MessagingStack.addSpacer()

  const LinkPreviewStack = line2.addStack()
  const LinkPreview = LinkPreviewStack.addText('Link Previews')
  LinkPreview.font = Font.lightSystemFont(12)
  LinkPreviewStack.addSpacer(43) 
  if (data.status != 'ok' && dataServices.includes("Link Previews")) {
     if (dataType == "incident") {
     statusIcon = LinkPreviewStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = LinkPreviewStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = LinkPreviewStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = LinkPreviewStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = LinkPreviewStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
LinkPreviewStack.addSpacer()
  
  // ### Line Number 3 ###
  const line3 = widget.addStack()
  const PostsFilesStack = line3.addStack()
  const PostsFiles = PostsFilesStack.addText('Posts/Files')
  PostsFiles.font = Font.lightSystemFont(12)
  PostsFilesStack.addSpacer(53) 
  if (data.status != 'ok' && dataServices.includes("Posts/Files")) {
     if (dataType == "incident") {
     statusIcon = PostsFilesStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = PostsFilesStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = PostsFilesStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = PostsFilesStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = PostsFilesStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
  PostsFilesStack.addSpacer()

  const NotificationsStack = line3.addStack()
  const Notifications = NotificationsStack.addText('Notifications')
  Notifications.font = Font.lightSystemFont(12)
  NotificationsStack.addSpacer(48)
  if (data.status != 'ok' && dataServices.includes("Notifications")) {
     if (dataType == "incident") {
     statusIcon = NotificationsStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = NotificationsStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = NotificationsStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = NotificationsStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
    statusIcon = NotificationsStack.addImage(await getImageFor("OK"))
    statusIcon.imageSize = new Size(20, 20)
}
  
NotificationsStack.addSpacer()  
  
  // ### Line Number 4 ###  
  const line4 = widget.addStack()
  const CallsStack = line4.addStack()
  const Calls = CallsStack.addText('Calls')
  Calls.font = Font.lightSystemFont(12)
  CallsStack.addSpacer(85)
  if (data.status != 'ok' && dataServices.includes("Calls")) {
     if (dataType == "incident") {
     statusIcon = CallsStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = CallsStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = CallsStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = CallsStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = CallsStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}

  CallsStack.addSpacer()

  const SearchStack = line4.addStack()
  const Search = SearchStack.addText('Search')
  Search.font = Font.lightSystemFont(12)
  SearchStack.addSpacer(79)
  if (data.status != 'ok' && dataServices.includes("Search")) {
     if (dataType == "incident") {
     statusIcon = SearchStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = SearchStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = SearchStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = SearchStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = SearchStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
    
SearchStack.addSpacer()
  
  // ### Line Number 5 ###
  const line5 = widget.addStack()
  const AppsStack = line5.addStack()
  const Apps = AppsStack.addText('Apps/APIs/\nIntegrations')
  Apps.font = Font.lightSystemFont(12)
  AppsStack.addSpacer(46)
  if (data.status != 'ok' && dataServices.includes("Apps/Integrations/APIs")) {
     if (dataType == "incident") {
     statusIcon = AppsStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = AppsStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = AppsStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = AppsStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = AppsStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}
  
  AppsStack.addSpacer()

  const WorkspaceStack = line5.addStack()
  const Workspace = WorkspaceStack.addText('Workspace/Org/\nAdministration')
  Workspace.font = Font.lightSystemFont(12)
  WorkspaceStack.addSpacer(29)
  if (data.status != 'ok' && dataServices.includes("Workspace/Org Administration")) {
     if (dataType == "incident") {
     statusIcon = WorkspaceStack.addImage(await getImageFor("Incident"))
   } else if (dataType == "outage") {
     statusIcon = WorkspaceStack.addImage(await getImageFor("Outage"))
   } else if (dataType == "notice") {
     statusIcon = WorkspaceStack.addImage(await getImageFor("Notice"))
   } else if (dataType == "maintenance") {
     statusIcon = WorkspaceStack.addImage(await getImageFor("Maintenance"))
   }
     statusIcon.imageSize = new Size(20, 20)
} else {
   statusIcon = WorkspaceStack.addImage(await getImageFor("OK"))
   statusIcon.imageSize = new Size(20, 20)
}

WorkspaceStack.addSpacer()
widget.addSpacer()
  
// shows the last widget update
  dateFormatter.useMediumDateStyle();
  dateFormatter.useShortTimeStyle();
  
  const footer = widget.addText("Last Widget Refresh " + dateFormatter.string(newDate));  
  footer.font = Font.mediumSystemFont(9);
  footer.textOpacity = 0.16
  footer.centerAlignText()

return widget
}


// Runtime images:
await saveImages()
try {
  saveData(data)
} catch {}

if (config.runsInApp) {
    await presentMenu()
} else if (config.runsInWidget) {
  switch(widgetSize) {
    case "small": widget = await createSmallWidget();
    break;
    case "medium": widget = await createMediumWidget();
    break;
    case "large": widget = await createLargeWidget();
    break;
    default: widget = await createMediumWidget();
  }
  Script.setWidget(widget)
}

async function presentMenu() {
  let alert = new Alert(data)
  alert.title = "Slack Status Widget"
  alert.message = emoji + ' "' + data.status.toUpperCase() + '" ' + emoji
  alert.addAction("Small")
  alert.addAction("Medium")
  alert.addAction("Large")
  alert.addDestructiveAction("Web Dashboard ↗")
  alert.addCancelAction("Cancel")
  let idx = await alert.presentSheet(data)
  if (idx == 0) {
    let widget = await createSmallWidget(data)
    await widget.presentSmall()
  } else if (idx == 1) {
    let widget = await createMediumWidget(data)
    await widget.presentMedium()
  } else if (idx == 2) {
    let widget = await createLargeWidget(data)
    await widget.presentLarge()
  } else if (idx == 3) {
    Safari.openInApp("https://status.slack.com")
  } 
}
