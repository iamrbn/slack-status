//=======================================//
//=========== START OF MODULE ===========//
//============= Version 0.9 =================//


async function getFromAPI(){
    var api, noInternet, emoji
    try {
        api = await new Request('https://status.slack.com/api/v2.0.0/current').loadJSON()
        //console.log({api})
        noInternet = false
        emoji = " ✅ "
        if (api.status != "ok"){
            api = {
            created: api.date_created,
            updated: api.date_updated,
            id: api.active_incidents[0].id,
            incident_created: api.active_incidents[0].date_created,
            incident_updated: api.active_incidents[0].date_updated,
            title: api.active_incidents[0].title,
            type: api.active_incidents[0].type,
            status: api.active_incidents[0].status,
            url: api.active_incidents[0].url,
            services: api.active_incidents[0].services,
            notes_created: api.active_incidents[0].notes[0].date_created,
            notes_body: api.active_incidents[0].notes[0].body
        }
            if (api.type == "incident" || "active") emoji = " ⚠️ "
            else if (api.type == "outage") emoji = " ⛔️ "
            else if (api.type == "notice") emoji = " 🚩 "
            else if (api.type == "maintenance") emoji = " 🔧 "
        }
    } catch(err){
        noInternet = true
        if (config.runsInApp) await presentAlert(err.message)
        //throw new Error(err.message)
    }
    
return {api, noInternet, emoji}
};


async function createHeader(w, iSize, fSize){
     headerStack = w.addStack()
     headerStack.centerAlignContent()
     headerStack.url = "slack://"
     headerStack.spacing = 7
     
     headerIcon = headerStack.addImage(await getImageFor("slackIcon")).imageSize = new Size(iSize, iSize)
     //headerStack.addSpacer(7)
     headerTitle = headerStack.addText("Slack Status").font = new Font("Futura-Medium", fSize)
};


async function addString(widget, api, leftText, rightText){
  var image = 'ok'
  let line = widget.addStack()
       line.spacing = 15

  let firstStack = line.addStack()
       firstStack.centerAlignContent()
       firstStack.addText(leftText).font = Font.lightSystemFont(11)
       firstStack.addSpacer()

  if (api.status != 'ok' && api.services.includes(leftText)) image = api.type
  //else image = 'ok'
  
  if (leftText != "") firstStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20)

  let secondStack = line.addStack()
       secondStack.centerAlignContent()
       secondStack.addText(rightText).font = Font.lightSystemFont(11)
       secondStack.addSpacer()
       
  if (api.status != 'ok' && api.services.includes(rightText)) image = api.type
  //else image = 'ok'
  
  if (rightText != "") secondStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20)
};


async function presentAlert(message){
  let alert = new Alert()
       alert.title = "No Api Response"
       alert.message = message
       alert.addAction("OK")
       await alert.present()
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
  let imgs = ["slackIcon.png", "ok.png", "incident.png", "outage.png", "notice.png", "maintenance.png"]
  for (img of imgs){
        img_path = fm.joinPath(dir, img)
        if (!fm.fileExists(img_path)){
            console.log("Loading image: " + img)
            request = new Request(imgURL + img)
            image = await request.loadImage()
            fm.writeImage(img_path, image)
        }
    }
};


function createIssueNotification(api, nKey){
  let notify = new Notification()
       notify.title = `Slack ${api.type}`.toUpperCase()
       notify.subtitle = `Trouble with: ${api.services}`
       notify.openURL = api.url
       notify.body = api.notes_body
       notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
       notify.addAction("Show " + api.type + " ID " + api.id, api.url, true)
       notify.identifier = `ID_${api.id}`
       notify.threadIdentifier = Script.name()
       notify.preferredContentHeight = 77
       notify.scriptName = Script.name()
       notify.userInfo = {"imgName":api.type}
       notify.schedule()
    
       nKey.set("current_issue", api. incident_updated)
};


function createOkNotification(api, nKey){
  let notify = new Notification()
       notify.title = "Slack is now running again"
       notify.subtitle = "Trouble has been solved"
       notify.identifier = api.incident_updated
       notify.threadIdentifier = Script.name()
       notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
       notify.scriptName = Script.name()
       notify.preferredContentHeight = 77
       notify.userInfo = {"imgName":'ok'}
       notify.schedule()
    
        nKey.set("current_issue", api.incident_updated)
};


async function createErrorWidget(pddng, bgGradient){
  let errWidget = new ListWidget()
       errWidget.setPadding(pddng, pddng, pddng, pddng)
       errWidget.backgroundGradient = bgGradient
       errWidget.addImage(await getImageFor("sadSlackBot-badConnection")).cornerRadius = 20
       
       errWidget.addSpacer()
       
       errWidget.addText("No API Response").font = Font.headline()
       errWidget.addText("Please ckeck your internet connection").font = Font.subheadline()
    
  return errWidget
};


//Checks if's there an server update on GitHub available
async function updateCheck(fm, modulePath, version){
    let url = 'https://raw.githubusercontent.com/iamrbn/slack-status/main/'
    let endpoints = ['slack-status-widget.js', 'slackModule.js']
    let uC
    try {
      updateCheck = new Request(url+endpoints[0]+'on')
      uC = await updateCheck.loadJSON()
    } catch (err){
      throw new Error(err.message)
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
                 
                if (await newAlert.present() === 0){
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
