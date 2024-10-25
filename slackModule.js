//=======================================//
//=========== START OF MODULE ===========//
//============= Version 0.8 =============//


async function getFromAPI(){
    var api;
    var noInternet;
    var emoji;
    try {
        api = await new Request('https://status.slack.com/api/v2.0.0/current').loadJSON()
        //console.log({api})
        noInternet = false
        emoji = " ✅ "
        if (api.status != "ok") {
            dateCreated = api.date_created
            dateUpdated = api.date_updated
            dataID = api.active_incidents[0].id
            dateCreated2 = api.active_incidents[0].date_created
            dateUpdated2 = api.active_incidents[0].date_updated
            dataTitle = api.active_incidents[0].title
            dataType = api.active_incidents[0].type
            dataStatus = api.active_incidents[0].status
            dataURL = api.active_incidents[0].url
            dataServices = api.active_incidents[0].services
            dateCreatedBody = api.active_incidents[0].notes[0].date_created
            dataBody = api.active_incidents[0].notes[0].body

            if (api.active_incidents[0].type == "incident" || "active") emoji = " ⚠️ "
            else if (api.active_incidents[0].type == "outage") emoji = " ⛔️ "
            else if (api.active_incidents[0].type == "notice") emoji = " 🚩 "
            else if (api.active_incidents[0].type == "maintenance") emoji = " 🔧 "
        }
    } catch (err){
        logError(err.message)
        noInternet = true
        if (config.runsInApp) await presentAlert(err.message)
    }
    
    var datas = {api, noInternet, emoji}
return datas
};


async function createHeader(w, iSize, fSize) {
   headerStack = w.addStack()
   headerStack.centerAlignContent()
   headerStack.url = "slack://"
   headerStack.spacing = 7

   headerIcon = headerStack.addImage(await getImageFor("slackIcon")).imageSize = new Size(iSize, iSize)
   //headerStack.addSpacer(7)
   headerTitle = headerStack.addText("Slack Status").font = new Font("Futura-Medium", fSize)
};


async function addString(widget, api, leftText, rightText) {
  let line = widget.addStack()
       line.spacing = 15

  let firstStack = line.addStack()
      firstStack.centerAlignContent()
      firstStack.addText(leftText).font = Font.lightSystemFont(11)
      firstStack.addSpacer()
  if (api.status != 'ok' && dataServices.includes(leftText)) image = dataType
  else image = 'ok'
  if (leftText != "") firstStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20)
      
  let secondStack = line.addStack()
      secondStack.centerAlignContent()
      secondStack.addText(rightText).font = Font.lightSystemFont(11)
      secondStack.addSpacer()
  if (api.status != 'ok' && dataServices.includes(rightText)) image = dataType
  else image = 'ok'
  if (rightText != "") secondStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20)
};


async function presentAlert(message) {
  let alert = new Alert()
      alert.title = "No Api Response"
      alert.message = message
      alert.addAction("OK")
      idx = await alert.present()
  //if (idx == 0) Safari.open("prefs:root")
};


async function getImageFor(name){
    fm = FileManager.iCloud()
    dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
	imgPath = fm.joinPath(dir, name + '.png')
	await fm.downloadFileFromiCloud(imgPath)
	img = await fm.readImage(imgPath)
  return img
};


/*
async function presentMenu(emoji, api, widget){
	let alert = new Alert()
	alert.title = "Slack Status"
	alert.message = emoji + api.status.toUpperCase() + emoji
	alert.addAction("Small")
	alert.addAction("Medium")
	alert.addAction("Large")
	alert.addAction("Small LS")
	alert.addAction("Medium LS")
	alert.addAction("Error Widget")
	alert.addAction("Web Dashboard ↗")
	alert.addCancelAction("Cancel")
	idx = await alert.present()
	if (idx === 0){
		w = widget//await createSmallWidget()
		await w.presentSmall()
	} else if (idx == 1) {
		let widget = await createMediumWidget()
		await widget.presentMedium()
	} else if (idx == 2) {
		let widget = await createLargeWidget()
		await widget.presentLarge()
   	} else if (idx == 3) {
   	    let widget = await createSmallLSW()
		await widget.presentAccessoryCircular()
	} else if (idx == 4) {
        let widget = await createMediumLSW()
		await widget.presentAccessoryRectangular()
	} else if (idx == 5) {
        let widget = await createErrorWidget(20)
     	await widget.presentMedium()
      } else if (idx == 1){
            Safari.openInApp("https://status.slack.com", false)
      }
};
*/


// LOADING AND SAVING IMAGES FROM URL TO FOLDER
async function saveImages(fm, dir){
	let imgURL = "https://raw.githubusercontent.com/iamrbn/slack-status/main/Symbols/"
	var imgs = ["slackIcon.png", "ok.png", "incident.png", "outage.png", "notice.png", "maintenance.png"]
	for (img of imgs){
		let img_path = fm.joinPath(dir, img)
		if (!fm.fileExists(img_path)){
			console.log("Loading image: " + img)
			let request = new Request(imgURL + img)
			image = await request.loadImage()
			fm.writeImage(img_path, image)
		}
	}
};


function createIssueNotification(api, nKey){
 let notify = new Notification()
     notify.title = `Slack ${api.active_incidents[0].type}`.toUpperCase()
     notify.subtitle = `Trouble with: ${api.active_incidents[0].services}`
     notify.openURL = api.active_incidents[0].url
     notify.body = api.active_incidents[0].notes[0].body
     notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
     notify.addAction("Show " + api.active_incidents[0].type + " ID " + api.active_incidents[0].id, api.active_incidents[0].url, true)
     notify.identifier = `ID_${api.active_incidents[0].id}`
     notify.threadIdentifier = Script.name()
     notify.preferredContentHeight = 77
     notify.scriptName = Script.name()
     notify.userInfo = {"imgName":dataType}
     notify.schedule()
    
  nKey.set("current_issue", api.date_updated)
};


function createOkNotification(api, nKey){
 let notify = new Notification()
     notify.title = "Slack is now running again"
     notify.subtitle = "Trouble has been solved"
     notify.identifier = api.date_updated
     notify.threadIdentifier = Script.name()
     notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
     notify.scriptName = Script.name()
     notify.preferredContentHeight = 77
     notify.userInfo = {"imgName":'ok'}
     notify.schedule()
    
  nKey.set("current_issue", api.date_updated)
};


async function createErrorWidget(pddng, bgGradient) {
  let errWidget = new ListWidget()
       errWidget.setPadding(pddng, pddng, pddng, pddng)
       errWidget.backgroundGradient = bgGradient
       errWidget.addImage(await getImageFor("sadSlackBot-badConnection")).cornerRadius = 20
       errWidget.addSpacer()
       wTitle = errWidget.addText("No API Response").font = Font.headline()
       wSubtitle = errWidget.addText("Please ckeck your internet connection").font = Font.subheadline()
  return errWidget
};


//Checks if's there an server update on GitHub available
async function updateCheck(fm, modulePath, version){
  let url = 'https://raw.githubusercontent.com/iamrbn/Inline-Weather/main/'
  let endpoints = ['Inline-Weather.js', 'module.js']
  
    let uC;
    try {
      updateCheck = new Request(url+endpoints[0]+'on')
      uC = await updateCheck.loadJSON()
    } catch (e){
        return log(e)
        }

  needUpdate = false
  if (uC.version > version){
     needUpdate = true
    if (config.runsInApp){
      //console.error(`New Server Version ${uC.version} Available`)
      let newAlert = new Alert()
          newAlert.title = `New Server Version ${uC.version} Available!`
          newAlert.addAction("OK")
          newAlert.addDestructiveAction("Later")
          newAlert.message="Changes:\n" + uC.notes + "\n\nOK starts the download from GitHub\n More informations about the update changes go to the GitHub Repo"
      if (await newAlert.present() == 0){
        reqCode = new Request(url+endpoints[0])
        updatedCode = await reqCode.loadString()
        pathCode = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        fm.writeString(pathCode, updatedCode)
        reqModule = new Request(url+endpoints[1])
        moduleFile = await reqModule.loadString()
        fm.writeString(modulePath, moduleFile)
        throw new Error("Update Complete!")
      }
    }
  } else {
      log(">> SCRIPT IS UP TO DATE!")
      }
  return {uC, needUpdate}
};


//Exports Functions
module.exports = {
    getFromAPI,
    createErrorWidget,
    createHeader,
    addString,
    presentAlert,
    //presentMenu,
    saveImages,
    getImageFor,
    createIssueNotification,
    createOkNotification,
    updateCheck
};


//=========================================//
//============== END OF MODULE ============//
//=========================================//
