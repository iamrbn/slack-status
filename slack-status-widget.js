// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple icon-glyph: hashtag
// Script is written by iamrbn - GitHub (u/iamrbn → Reddit, iamrbn_ → Twitter)
// Script = https://github.com/iamrbn/slack-status

let getStatusNotifications = true //Set to false if you dont wanna get notifications!

let nKey = Keychain
let nParameter = await args.notification
let refreshInt = await args.widgetParameter
if (refreshInt == null) refreshInt = 60 //in minutes
let bgColor = Color.dynamic(Color.white(), new Color("#481349"))
let txtColor = Color.dynamic(Color.black(), Color.white())
let newDate = new Date()
let dateFormatter = new DateFormatter()
let wSize = config.widgetFamily
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let modulePath = fm.joinPath(dir, 'slackModule.js')
if (!fm.fileExists(modulePath)) await loadModule()
if (!fm.isFileDownloaded(modulePath)) await fm.downloadFileFromiCloud(modulePath)
let sModule = importModule(modulePath)
let uCheck = await sModule.updateCheck(fm, modulePath, 1.4)
let top = Color.dynamic(new Color('#ffffff'), new Color('#4E1E54'))
let middle = Color.dynamic(new Color('#EDEDED'), new Color('#481C4D'))
let bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#441A49'))
let bgGradient = new LinearGradient()
    bgGradient.locations = [0, 0.4, 1]
    bgGradient.colors = [top, middle, bottom]     

await sModule.saveImages(fm, dir)
let data = await sModule.getFromAPI()
let api = data.api

if (config.runsInApp && !data.noInternet){
	 Safari.openInApp("https://status.slack.com", false)
} else if (config.runsInWidget || config.runsInAccessoryWidget){
  switch (wSize) {
    	case "small":
        if (data.noInternet) w = await sModule.createErrorWidget(10, bgGradient)
        else w = await createSmallWidget()
	break;
    	case "medium":
        if (data.noInternet) w = await sModule.createErrorWidget(20, bgGradient)
        else w = await createMediumWidget()
	break;
    	case "large":
        if (data.noInternet) w = await sModule.createErrorWidget(25, bgGradient)
    	   else w = await createLargeWidget()
	break;
      case "accessoryRectangular": w = await createMediumLSW()
      break;
    	default: w = await sModule.createErrorWidget(20, bgGradient)
	}
	Script.setWidget(w)
} else if (config.runsInNotification) QuickLook.present(await sModule.getImageFor(nParameter.userInfo.imgName))

if (!nKey.contains("current_issue")) nKey.set("current_issue", api.incident_updated)
//log(nKey.get("current_issue"))
if (getStatusNotifications){
  if (nKey.get("current_issue") != api.incident_updated && api.status != 'ok') await sModule.createIssueNotification(api, nKey)
  else if (nKey.get("current_issue") != api.incident_updated && api.status == 'ok') await sModule.createOkNotification(api, nKey)
};


async function createMediumLSW(){
  let w = new ListWidget()
      w.setPadding(0, 0, 0, 0)
      w.url = "https://status.slack.com"
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      //w.addAccessoryWidgetBackground = true
      
  let bgStack = w.addStack()
      bgStack.layoutVertically()
      //bgStack.backgroundColor = new Color('#D5D7DC1a')
      bgStack.size = new Size(140, 57)
      bgStack.setPadding(3, 3, 0, 10)
      bgStack.cornerRadius = 10
      bgStack.borderColor = Color.white()
      bgStack.borderWidth = 3
                
  let hStack = bgStack.addStack()
      hStack.spacing = 5
      hStack.centerAlignContent()
           
  let hImage = hStack.addImage(await sModule.getImageFor("slackIcon")).imageSize = new Size(13, 13)
  let hTitle = hStack.addText("Slack Status").font = new Font("Futura-Bold", 12)
      
  let byStack = bgStack.addStack()
      byStack.centerAlignContent()
      byStack.spacing = 1
      
  if (api.status == 'ok') {
      statusText = byStack.addText("is up and running")
      byStack.addSpacer()
      statusImage = byStack.addImage(await sModule.getImageFor(api.status))
  } else {
      statusText = byStack.addText("Trouble with:\n" + api.services)
      byStack.addSpacer()         
      statusImage = byStack.addImage(await sModule.getImageFor(api.type))
  }
      
      statusImage.size = new Size(35, 35) 
      statusText.font = new Font("Futura-Medium", 9)
      statusText.minimumScaleFactor = 0.5
      statusText.lineLimit = 3
      
      dateFormatter.useShortTimeStyle()
  let footer = bgStack.addText("Widget Update " + dateFormatter.string(new Date()))
      footer.font = new Font("Futura-Medium", 7)
      footer.textOpacity = 0.5
      footer.rightAlignText()
      
  return w
};


// ############ SETUP SMALL WIDGET ############
async function createSmallWidget(){
  let w = new ListWidget()
      w.url = "https://status.slack.com"
      w.backgroundGradient = bgGradient
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)

      await sModule.createHeader(w, 20, 17)

      w.addSpacer(3)

	if (api.status == 'ok'){
      statusImage = w.addImage(await sModule.getImageFor(api.status))
      statusTitle = w.addText("is up and running")
      w.addSpacer()
	} else {
		statusImage = w.addImage(await sModule.getImageFor(api.type))
            
		headline = w.addText("Trouble with")
		headline.textColor = Color.red()
		headline.font = Font.semiboldSystemFont(11)
		headline.centerAlignText()

     statusTitle = w.addText(String(api.services).replace(" ", "\n"))
     statusTitle.textColor = Color.red()
     statusTitle.lineLimit = 3
     statusTitle.minimumScaleFactor = 0.8
	}
  
     statusImage.imageSize = new Size(77, 77)  
     statusImage.centerAlignImage()
  
     statusTitle.font = Font.lightSystemFont(12)  
     statusTitle.centerAlignText()

  if (uCheck.needUpdate){
      updateInfo = w.addText(`Update ${uCheck.version} Available!`)
      updateInfo.font = Font.lightRoundedSystemFont(11)
      updateInfo.centerAlignText()
      updateInfo.textColor = Color.red()
      widgetURL = 'https://github.com/iamrbn/slack-status/tree/main'
      w.url = "https://status.slack.com"
}

      dateFormatter.useShortTimeStyle()
  let footer = w.addText("Last Update " + dateFormatter.string(new Date()))
      footer.font = Font.mediumSystemFont(9)
      footer.textOpacity = 0.16
      footer.centerAlignText()

	return w
};


// ########### SETUP MEDIUM WIDGET ###########
async function createMediumWidget() {
  let w = new ListWidget()
      w.setPadding(10, 10, 5, 10)
      w.backgroundGradient = bgGradient
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)

      await sModule.createHeader(w, 25, 25)

    	w.addSpacer()

  let mainStack = w.addStack()

	// Left stack contains the status text
  let leftStack = mainStack.addStack()
      leftStack.layoutVertically()

	// Right stack contains the status icon
  let rightStack = mainStack.addStack()
      rightStack.layoutVertically()

	if (api.status == 'ok') {
      rightStack.setPadding(0, 30, 15, 0)
      leftStack.setPadding(0, 10, 0, 0)

      leftStack.addSpacer(25)

      statusTitle = leftStack.addText("Slack is up and running 🚀")
      statusTitle.font = Font.lightSystemFont(14)

      leftStack.addSpacer(7)

      linkStack = leftStack.addStack()
      linkStack.centerAlignContent()
      linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues"

      linkElement = linkStack.addText("Having trouble? ")
      linkElement.textColor = Color.gray()
      linkElement.font = Font.lightSystemFont(11)
      linkElement.textOpacity = 0.4

      linkSymbolElement = linkStack.addImage(SFSymbol.named("safari").image)
      linkSymbolElement.imageSize = new Size(12, 12)
      linkSymbolElement.tintColor = Color.gray()
      linkSymbolElement.imageOpacity = 0.2
      
      StatusImage = rightStack.addImage(await sModule.getImageFor('ok'))
      StatusImage.url = "https://status.slack.com"
	} else {
		StatusImage = rightStack.addImage(await sModule.getImageFor(api.type))

		StatusImage.url = api.url
		leftStack.setPadding(0, 5, 0, 0)
		rightStack.setPadding(0, 5, 5, 0)

		w.addSpacer(7)

		apiTitle = leftStack.addText(api.title)
		apiTitle.font = Font.boldSystemFont(12)
		apiTitle.textColor = Color.red()
		apiTitle.lineLimit = 2
		apiTitle.minimumScaleFactor = 0.5

		leftStack.addSpacer(3)

		apiBody = leftStack.addText(api.notes_body)
		apiBody.font = Font.lightSystemFont(12)
		apiBody.minimumScaleFactor = 0.6
		apiBody.textColor = Color.red()

		leftStack.addSpacer(3)

     linkStack = leftStack.addStack()
     linkStack.centerAlignContent()
     linkStack.url = api.dataURL
  
     linkSymbolElement = linkStack.addImage(SFSymbol.named("info.circle").image)
     linkSymbolElement.imageSize = new Size(9, 9)
     linkSymbolElement.tintColor = Color.blue()
  
     linkStack.addSpacer(3)

		linkElement = linkStack.addText("Read more about " + api.type + " ID " + api.id)
     linkElement.textColor = Color.blue()
     linkElement.font = new Font("PingFangTC-Thin", 10)
	}

  if (uCheck.needUpdate){
      updateInfo = w.addText(`Update ${uCheck.version} Available!`)
      updateInfo.font = Font.regularRoundedSystemFont(14)
      updateInfo.url = 'https://github.com/iamrbn/slack-status/tree/main'
      updateInfo.textColor = Color.red()
      updateInfo.centerAlignText()
      widget.url = 'https://github.com/iamrbn/slack-status/tree/main'
}

      dateFormatter.useShortDateStyle()
      dateFormatter.useShortTimeStyle()

  let footer = w.addText("Last Widget Refresh " + dateFormatter.string(newDate))
      footer.font = Font.mediumSystemFont(9)
      footer.textOpacity = 0.16
      footer.centerAlignText()

	return w
};


// ############ SETUP LARGE WIDGET ##############
async function createLargeWidget() {
  let w = new ListWidget()
      w.backgroundGradient = bgGradient
      w.setPadding(15, 15, 5, 15)
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      
      await sModule.createHeader(w, 25, 23)

  if (uCheck.needUpdate){
      w.addSpacer(7)
      updateInfo = w.addText(`Update ${uCheck.version} Available!`)
      updateInfo.font = Font.regularRoundedSystemFont(14)
      updateInfo.url = 'https://github.com/iamrbn/slack-status/tree/main'
      updateInfo.textColor = Color.red()
      updateInfo.centerAlignText()
      w.url = 'https://github.com/iamrbn/slack-status/tree/main'
}
      w.addSpacer()

	// content of the widget
	if (api.status == 'ok') {
		w.addSpacer()
		StatusImage = w.addImage(await sModule.getImageFor("ok"))

		w.addSpacer()

		StatusImage.centerAlignImage()
		StatusImage.imageSize = new Size(77, 77)
		StatusImage.url = "https://status.slack.com"
		statusTitle = w.addText("Slack is up and running")
		statusTitle.font = new Font("Futura-Medium", 17)

		w.addSpacer(5)

 let linkStack = w.addStack()
     linkStack.setPadding(0, 103, 0, 0)
    	linkStack.centerAlignContent()
    	linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues"

 let linkElement = linkStack.addText("Having trouble? ")
    	linkElement.textColor = Color.gray()
    	linkElement.font = Font.lightSystemFont(11)
    	linkElement.textOpacity = 0.4

 let linkSymbolElement = linkStack.addImage(SFSymbol.named("safari").image)
     linkSymbolElement.imageSize = new Size(12, 12)
     linkSymbolElement.tintColor = Color.gray()
     linkSymbolElement.imageOpacity = 0.2

		statusTitle.font = new Font("Futura-Medium", 17)
		statusTitle.centerAlignText()
		w.addSpacer()
} else {
		StatusImage = w.addImage(await sModule.getImageFor(api.type))
		StatusImage.imageSize = new Size(77, 77)
		StatusImage.centerAlignImage()
		StatusImage.url = api.url
            
      w.addSpacer(-35)

		apiTitle = w.addText(api.title)
		apiTitle.font = Font.semiboldSystemFont(14)
		apiTitle.minimumScaleFactor = 0.5
		apiTitle.textColor = Color.red()
		apiTitle.centerAlignText()
		apiTitle.lineLimit = 2

		w.addSpacer(3)

		apiBody = w.addText(api.notes_body)
		apiBody.font = Font.lightSystemFont(10)
		apiBody.minimumScaleFactor = 0.7
		apiBody.textColor = Color.red()
		apiBody.centerAlignText()

    	linkStack = w.addStack()
		linkStack.centerAlignContent()
		linkStack.setPadding(0, 50, 0, 0)
		linkStack.url = api.url

		linkElement = linkStack.addText("Read more about " + api.type + " ID " + api.id)
		linkElement.textColor = Color.blue()
		linkElement.font = Font.lightSystemFont(12)

		linkStack.addSpacer(3)

		linkSymbolElement = linkStack.addImage(SFSymbol.named("info.circle").image)
		linkSymbolElement.imageSize = new Size(12, 12)
		linkSymbolElement.tintColor = Color.blue()
	}

	w.addSpacer()
  
  await sModule.addString(w, api, "Login/SSO", "Connectivity")
  await sModule.addString(w, api, "Messaging", "Files")
  await sModule.addString(w, api, "Notifications", "Huddles")
  await sModule.addString(w, api, "Search", "Workflows")
  await sModule.addString(w, api, "Canvases", "Workspace/Org Administration")
  await sModule.addString(w, api, "Apps/Integrations/APIs", "")

	w.addSpacer()

	// shows the last widget update
    	dateFormatter.useMediumDateStyle()
    	dateFormatter.useShortTimeStyle()
  let footer = w.addText("Last Widget Refresh " + dateFormatter.string(newDate))
      footer.font = Font.mediumSystemFont(9)
      footer.textOpacity = 0.16
      footer.centerAlignText()

	return w
};


//Loads javascript module if needed
async function loadModule(){
   req = new Request('https://raw.githubusercontent.com/iamrbn/slack-status/main/slackModule.js')
   moduleFile = await req.loadString()
   fm.writeString(modulePath, moduleFile)
   console.warn('loaded module file from github')
};


//============ END OF SCRIPT ============\\
//=======================================\\
