// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple icon-glyph: hashtag
// Script is written by iamrbn - GitHub (u/iamrbn → Reddit, iamrbn_ → Twitter)
// Script = https://github.com/iamrbn/slack-status

const getStatusNotifications = true //Set to false if you dont wanna get notifications!
const refreshInt = 60 //in minutes

let nKey = Keychain
let nParameter = await args.notification
let bgColor = Color.dynamic(Color.white(), new Color("#481349"))
let txtColor = Color.dynamic(Color.black(), Color.white())
let dateFormatter = new DateFormatter()
let wSize = config.widgetFamily
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let modulePath = fm.joinPath(dir, 'slackModule.js')
if (!fm.fileExists(modulePath)) await loadModule()
if (!fm.isFileDownloaded(modulePath)) await fm.downloadFileFromiCloud(modulePath)
let sModule = importModule(modulePath)
let uCheck = await sModule.updateCheck(1.5)
await sModule.saveImages()
let data = await sModule.getFromAPI()

if (config.runsInApp && typeof data !== 'number'){
    Safari.openInApp("https://status.slack.com", false)
} else if (config.runsInWidget || config.runsInAccessoryWidget){
  switch (wSize){
    case "accessoryCircular":
        if (typeof data === 'number' || uCheck.needUpdate) w = await sModule.infoWidget(wSize, data, uCheck)
        else w = await createCircular()
    break;
    case "accessoryRectangular":
        if (typeof data === 'number' || uCheck.needUpdate) w = await sModule.infoWidget(wSize, data, uCheck)
        else w = await createRectangular()
    break;
    case "small":
        if (typeof data === 'number' || uCheck.needUpdate) w = await sModule.infoWidget(wSize, data, uCheck)
        else w = await createSmall()
	 break;
    case "medium":
        if (typeof data === 'number' || uCheck.needUpdate) w = await sModule.infoWidget(wSize, data, uCheck)
        else w = await createMedium()
	 break;
    case "large":
        if (typeof data === 'number' || uCheck.needUpdate) w = await sModule.infoWidget(wSize, data, uCheck)
    	   else w = await createLarge()
	break;
  
    default: w = await sModule.infoWidget(wSize, data, uCheck)
	}
	Script.setWidget(w)
} else if (config.runsInNotification){
    QuickLook.present(await sModule.getImage(nParameter.userInfo.imgName, null))
} else if (config.runsInApp){
     w = await sModule.infoWidget('medium', data, uCheck)
     w.presentMedium()
  }

if (!nKey.contains("current_issue") && typeof data !== 'number') nKey.set("current_issue", data.date_updated)
//log(nKey.get("current_issue"))
//log(data.updated)
if (getStatusNotifications && typeof data !== 'number'){
  if (nKey.get("current_issue") != data.updated && data.status != 'ok') await sModule.createIssueNotification(data, nKey)
  else if (nKey.get("current_issue") != data.updated && data.status == 'ok') await sModule.createOkNotification(data, nKey)
};


async function createCircular(){
  let w = new ListWidget()
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      //w.addAccessoryWidgetBackground = true
      
      image = (data.status === 'ok') ? await sModule.getImage(data.status, null) : await sModule.getImage(data.type, null)
      
  let img = w.addImage(image)
      img.applyFillingContentMode()
      img.centerAlignImage()
  
  return w
};


async function createRectangular(){
  let w = new ListWidget()
      w.setPadding(0, 0, 0, 0)
      w.url = "https://status.slack.com"
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      //w.addAccessoryWidgetBackground = true
      
  let bgStack = w.addStack()
      bgStack.layoutVertically()
      bgStack.size = new Size(154, 68)//(140, 57)
      bgStack.setPadding(3, 5, 2, 8)
      bgStack.cornerRadius = 10
      bgStack.borderColor = Color.white()
      bgStack.borderWidth = 2
      
      await sModule.createHeader(bgStack, 11, 11)

  let byStack = bgStack.addStack()
      byStack.centerAlignContent()
      byStack.spacing = 1
      
  if (data.status == 'ok'){
      statusText = byStack.addText("is up and running")
      byStack.addSpacer()
      statusImage = byStack.addImage(await sModule.getImage(data.status, null))
  } else {
      statusText = byStack.addText("Trouble with\n" + data.services)
      byStack.addSpacer()         
      statusImage = byStack.addImage(await sModule.getImage(data.type, null))
  }
      
      statusImage.size = new Size(35, 35) 
      statusText.font = Font.regularRoundedSystemFont(9)
      statusText.minimumScaleFactor = 0.5
      statusText.lineLimit = 3
      
      dateFormatter.useShortTimeStyle()
  let footer = bgStack.addText("Widget Refresh " + dateFormatter.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(6)
      footer.textOpacity = 0.5
      footer.rightAlignText()
      
  return w
};


// ############ SETUP SMALL WIDGET ############
async function createSmall(){
  let w = new ListWidget()
      w.url = "https://status.slack.com"
      w.backgroundGradient = await sModule.createGradient()
      w.setPadding(8, 10, 1, 10)
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)

      await sModule.createHeader(w, 15, 18)

      w.addSpacer()
        
  let imgStack = w.addStack()
      imgStack.centerAlignContent()
      
      imgStack.addSpacer()

	if (data.status === 'ok'){
       statusImage = w.addImage(await sModule.getImage(data.status, null)).centerAlignImage()
       statusTitle = w.addText("is up and running")
	} else {
		 statusImage = imgStack.addImage(await sModule.getImage(data.type, null)).centerAlignImage()
            
		 headline = w.addText("Trouble with")
		 headline.textColor = Color.red()
		 headline.font = Font.semiboldSystemFont(11)
		 headline.centerAlignText()

      statusTitle = w.addText(String(data.services).replace(" ", "\n"))
      statusTitle.textColor = Color.red()
      statusTitle.lineLimit = 3
      statusTitle.minimumScaleFactor = 0.7
	}
     
      imgStack.addSpacer()
    
      statusTitle.font = Font.lightSystemFont(12)  
      statusTitle.centerAlignText()
		 
	   w.addSpacer()

      dateFormatter.useShortTimeStyle()
  let footer = w.addText("Last Update " + dateFormatter.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(8)
      footer.textOpacity = 0.2
      footer.centerAlignText()

	return w
};


// ########### SETUP MEDIUM WIDGET ###########
async function createMedium(){
  let w = new ListWidget()
      w.setPadding(8, 12, 1, 12)
      w.backgroundGradient = await sModule.createGradient()
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      
      await sModule.createHeader(w, 18, 20)
      
  let mainStack = w.addStack()
      mainStack.centerAlignContent()
      mainStack.borderColor = Color.purple()
      
	// Left stack contains the status text
  let leftStack = mainStack.addStack()
      leftStack.layoutVertically()
      leftStack.centerAlignContent()
      
      mainStack.addSpacer()
      
	// Right stack contains the status icon
  let rightStack = mainStack.addStack()
      rightStack.layoutVertically()
      rightStack.setPadding(20, 0, 20, 5)
      
  if (data.status === 'ok'){
      statusTitle = leftStack.addText("Slack is up and running")
      statusTitle.font = Font.lightRoundedSystemFont(14)
      
      linkStack = leftStack.addStack()
      linkStack.centerAlignContent()
      linkStack.spacing = 3
      
      linkSymbol = linkStack.addImage(SFSymbol.named("safari").image)
      linkSymbol.imageSize = new Size(10, 10)
      linkSymbol.tintColor = Color.white()
      linkSymbol.imageOpacity = 0.3
      
      linkText = linkStack.addText("Having trouble?")
      linkText.textColor = Color.white()
      linkText.font = Font.thinRoundedSystemFont(10)
      linkText.textOpacity = 0.3
      linkText.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues"
      
      StatusImage = rightStack.addImage(await sModule.getImage('ok', null))
      StatusImage.url = "https://status.slack.com"
      
	} else {
      
		dataTitle = leftStack.addText(data.title)
		dataTitle.font = Font.boldSystemFont(12)
		dataTitle.textColor = Color.red()
		dataTitle.lineLimit = 2
		dataTitle.minimumScaleFactor = 0.5

		dataBody = leftStack.addText(data.notes_body)
		dataBody.font = Font.lightSystemFont(12)
		dataBody.minimumScaleFactor = 0.7
		dataBody.textColor = Color.red()
      
     linkStack = leftStack.addStack()
     linkStack.centerAlignContent()
     linkStack.spacing = 3
     linkStack.url = data.dataURL
  
     linkSymbol = linkStack.addImage(SFSymbol.named("info.circle").image)
     linkSymbol.imageSize = new Size(8, 8)
     linkSymbol.tintColor = Color.blue()

     linkText = linkStack.addText("Read more about " + data.type + " ID " + data.id)
     linkText.textColor = Color.blue()
     linkText.font = Font.lightRoundedSystemFont(9)
    
     StatusImage = rightStack.addImage(await sModule.getImage(data.type, null))
	  StatusImage.url = data.url
	}

      dateFormatter.useShortDateStyle()
      dateFormatter.useShortTimeStyle()

  let footer = w.addText("Last Widget Refresh " + dateFormatter.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(9)
      footer.textColor = Color.white()
      footer.textOpacity = 0.1
      footer.centerAlignText()

	return w
};


// ############ SETUP LARGE WIDGET ##############
async function createLarge() {
  let w = new ListWidget()
      w.backgroundGradient = await sModule.createGradient()
      w.setPadding(10, 15, 5, 15)
      w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt)
      
      await sModule.createHeader(w, 20, 22)

      w.addSpacer()

	// content of the widget
	if (data.status == 'ok') {
		w.addSpacer()
		StatusImage = w.addImage(await sModule.getImage("ok", null))

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
		StatusImage = w.addImage(await sModule.getImage(data.type, null))
		StatusImage.imageSize = new Size(77, 77)
		StatusImage.centerAlignImage()
		StatusImage.url = data.url
            
      w.addSpacer(-35)

		dataTitle = w.addText(data.title)
		dataTitle.font = Font.semiboldSystemFont(14)
		dataTitle.minimumScaleFactor = 0.5
		dataTitle.textColor = Color.red()
		dataTitle.centerAlignText()
		dataTitle.lineLimit = 2

		w.addSpacer(3)

		dataBody = w.addText(data.notes_body)
		dataBody.font = Font.lightSystemFont(10)
		dataBody.minimumScaleFactor = 0.7
		dataBody.textColor = Color.red()
		dataBody.centerAlignText()

    	linkStack = w.addStack()
		linkStack.centerAlignContent()
		linkStack.setPadding(0, 50, 0, 0)
		linkStack.url = data.url

		linkElement = linkStack.addText("Read more about " + data.type + " ID " + data.id)
		linkElement.textColor = Color.blue()
		linkElement.font = Font.lightSystemFont(12)

		linkStack.addSpacer(3)

		linkSymbolElement = linkStack.addImage(SFSymbol.named("info.circle").image)
		linkSymbolElement.imageSize = new Size(12, 12)
		linkSymbolElement.tintColor = Color.blue()
	}

	w.addSpacer()
  
  await sModule.addString(w, data, "Login/SSO", "Connectivity")
  await sModule.addString(w, data, "Messaging", "Files")
  await sModule.addString(w, data, "Notifications", "Huddles")
  await sModule.addString(w, data, "Search", "Workflows")
  await sModule.addString(w, data, "Canvases", "Workspace/Org Administration")
  await sModule.addString(w, data, "Apps/Integrations/APIs", "")

	w.addSpacer()

	    // shows the last widget update
    	 dateFormatter.useShortDateStyle()
    	 dateFormatter.useShortTimeStyle()
  let footer = w.addText("Last Widget Refresh " + dateFormatter.string(new Date()))
      footer.font = Font.lightRoundedSystemFont(9)
      footer.textOpacity = 0.16
      footer.centerAlignText()

	return w
};


//Loads javascript module if needed
async function loadModule(){
  try {
   req = new Request('https://raw.githubusercontent.com/iamrbn/slack-status/main/slackModule.js')
   moduleFile = await req.loadString()
   fm.writeString(modulePath, moduleFile)
   console.warn('Loaded module file from github repo!')
  }catch(err){
   throw new Error('Failed to load module: '+err.message) 
  }
};


//============ END OF SCRIPT ============\\
//=======================================\\

