
//=======================================//
//=========== START OF MODULE ===========//
//============= Version 1.1 =============//


async function getFromAPI(){
    let api, res;
    try {
        api = await new Request('https://status.slack.com/api/v2.0.0/current').loadJSON()
        //console.log(JSON.stringify(api, null, 1))
        if (api.status !== 'ok'){
            res = {
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
        } else {
            res = {
                status: api.status,
                created: api.date_created,
                updated: api.date_updated,
                incident: api.active_incidents
            }
        }
    } catch(err){
        res = 404
        console.error(err.message)
    }
    return res
};


async function createGradient(){
    gradient = Object.assign(new LinearGradient(), {
        colors: [
            Color.dynamic(new Color('#FFFFFF'), new Color('#4E1E54')),
            Color.dynamic(new Color('#EDEDED'), new Color('#481C4D')),
            Color.dynamic(new Color('#D4D4D4'), new Color('#441A49'))
            ],
        locations: [0, 0.4, 1]
    })
    
    return gradient
};

async function createHeader(widget, imgSize, fontSize){
     headerStack = widget.addStack()
     headerStack.centerAlignContent()
     headerStack.url = "slack://"
     headerStack.spacing = 6
     
     headerIcon = headerStack.addImage(await getImage("slackIcon")).imageSize = new Size(imgSize, imgSize)
     headerTitle = headerStack.addText("Slack Status").font = new Font("Futura-Medium", fontSize)
};


async function addString(widget, api, leftText, rightText){
  let image = 'ok'
  let line = widget.addStack()
       line.spacing = 15

  let firstStack = line.addStack()
       firstStack.centerAlignContent()
       firstStack.addText(leftText).font = Font.lightSystemFont(11)
       firstStack.addSpacer()

  if (api.status != 'ok' && api.services.includes(leftText)) image = api.type

  if (leftText != "") firstStack.addImage(await getImage(image)).imageSize = new Size(20, 20)

  let secondStack = line.addStack()
       secondStack.centerAlignContent()
       secondStack.addText(rightText).font = Font.lightSystemFont(11)
       secondStack.addSpacer()
       
  if (api.status != 'ok' && api.services.includes(rightText)) image = api.type
  
  if (rightText != "") secondStack.addImage(await getImage(image)).imageSize = new Size(20, 20)
};


async function presentAlert(message){
    alert = new Alert()
    alert.title = "No API Response"
    alert.message = message
    alert.addAction("OK")
    await alert.present()
};


async function getImage(imgName, sfName){
    if (sfName != null){
        sf = SFSymbol.named(sfName)
        sf.applyFont(Font.thinRoundedSystemFont(500))
        img = sf.image
    } else if (imgName != null){
        fm = FileManager.iCloud()
        dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
        imgPath = fm.joinPath(dir, imgName + '.png')
        await fm.downloadFileFromiCloud(imgPath)
        img = await fm.readImage(imgPath)
     }

 return img
};


// LOADING AND SAVING IMAGES FROM URL TO FOLDER
async function saveImages(){
  fm = FileManager.iCloud()
  dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
  imgURL = "https://raw.githubusercontent.com/iamrbn/slack-status/main/Symbols/"
  imgs = ["slackIcon.png", "ok.png", "incident.png", "outage.png", "notice.png", "maintenance.png"]
  for (img of imgs){
        img_path = fm.joinPath(dir, img)
        if (!fm.fileExists(img_path)){
            console.log("Loading image: " + img)
            image = await new Request(imgURL + img).loadImage()
            fm.writeImage(img_path, image)
        }
    }
};


function createIssueNotification(api, nKey){
  let notify = new Notification()
       notify.title = `SLACK ${api.type}`.toUpperCase()
       notify.subtitle = `Trouble with: ${api.services}`
       notify.openURL = api.url
       notify.body = api.notes_body
       //notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
       notify.addAction(api.type + " ID_" + api.id, api.url)
       notify.identifier = `ID_${api.id}`
       notify.threadIdentifier = Script.name()
       notify.preferredContentHeight = 77
       notify.scriptName = Script.name()
       notify.userInfo = {"imgName":api.type}
       notify.schedule()
  
       nKey.set("current_issue", api.updated)
};


function createOkNotification(api, nKey){
  let notify = new Notification()
       notify.title = "Slack is now running again"
       notify.subtitle = "Trouble has been solved"
       notify.identifier = api.updated
       notify.openURL = 'https://status.slack.com'
       notify.threadIdentifier = Script.name()
       //notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com")
       notify.scriptName = Script.name()
       //notify.preferredContentHeight = 77
       notify.userInfo = {"imgName":'ok'}
       notify.schedule()
    
       nKey.set("current_issue", api.updated)
};


async function infoWidget(widgetSize, dataError, updateInfo){
    iWidget = new ListWidget()
    iWidget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 3)
    iWidget.backgroundGradient = await createGradient()
    
    img = (dataError === 404) ? await getImage("sadSlackBot-badConnection", null) : await getImage(null, "gear.badge")
    title = (dataError === 404) ? 'No API Response' : `New Script Version ${updateInfo.uC.version} Available`
    subtitle = (dataError === 404) ? 'Please check your internet connection' : updateInfo.uC.notes
    opacity = (dataError === 404) ? 1.0 : 0.5
    
    if (widgetSize === 'accessoryCircular'){
        iWidget.addAccessoryWidgetBackground = true
        text = iWidget.addText(title.replace('New Script ', '').replace(/(\d)\s/, '$1\n'))
        text.font = Font.boldMonospacedSystemFont(8)
        text.centerAlignText()
    } else if (widgetSize === 'accessoryRectangular'){
        iWidget.addAccessoryWidgetBackground = true
        //iWidget.addSpacer()
        iWidget.setPadding(2, 2, 2, 2)
        iStack = iWidget.addStack()
        iStack.spacing = 3
        tStack = iStack.addStack()
        tStack.layoutVertically()
        image = iStack.addImage(img)
        image.imageOpacity = 1
        image.imageSize = new Size(35, 35)
        image.cornerRadius = 7
        tStack.addText(title).font = new Font("Futura-Medium", 10)
        //iWidget.addSpacer()
    } else if (widgetSize === 'small'){
        iWidget.addSpacer()
        iWidget.setPadding(10, 10, 10, 10)
        image = iWidget.addImage(img)
        image.imageOpacity = opacity
        image.cornerRadius = 15
        //image.imageSize = new Size(22, 26)
        iWidget.addSpacer()
        iWidget.addText(title).font = new Font("Futura-Bold", 12)
        iWidget.addText(subtitle).font = new Font("Futura-Medium", 11)
        iWidget.addSpacer()
    } else if (widgetSize === 'medium'){
        iWidget.addSpacer()
        iWidget.setPadding(20, 20, 20, 20)
        image = iWidget.addImage(img)
        image.cornerRadius = 15
        image.imageOpacity = opacity
        //image.imageSize = new Size(26, 30)
        iWidget.addSpacer()
        iWidget.addText(title).font = new Font("Futura-Bold", 14)
        iWidget.addText(subtitle).font = new Font("Futura-Medium", 13)
        iWidget.addSpacer()
    }  else if (widgetSize === 'large'){
        iWidget.addSpacer()
        iWidget.setPadding(20, 20, 20, 20)
        image = iWidget.addImage(img)
        image.cornerRadius = 20
        image.imageOpacity = opacity
        image.imageSize = new Size(100, 100)
        iWidget.addSpacer(10)
        iWidget.addText(title).font = new Font("Futura-Bold", 15)
        iWidget.addText(subtitle).font = new Font("Futura-Medium", 14)
        iWidget.addSpacer()
    }

  return iWidget
  
};


//Checks if's there an server update on GitHub available
async function updateCheck(version){
    fm = FileManager.iCloud()
    dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget")
    url = 'https://raw.githubusercontent.com/iamrbn/slack-status/main/'
    endpoints = ['slack-status-widget.js', 'slackModule.js']
    
    try {
      uC = await new Request(url+endpoints[0]+'on').loadJSON()
    } catch (err){
      console.error('Error 404: ' + err.message)
      uC = 404
    }

    needUpdate = false
    if (typeof uC !== 'number' && uC.version > version){
      needUpdate = true
      if (config.runsInApp){
         //console.error(`New Server Version ${uC.version} Available`)
         let newAlert = new Alert()
              newAlert.title = `New Server Version ${uC.version} Available!`
              newAlert.addAction("OK")
              newAlert.addDestructiveAction("Later")
              newAlert.message = "Changes:\n" + uC.notes + "\n\nOK starts the download from GitHub\n More informations about the update changes go to the GitHub Repo"
         if ( await newAlert.present() === 0 ){
              updatedCode = await new Request(url+endpoints[0]).loadString()
              codePath = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
              fm.writeString(codePath, updatedCode)
              moduleFile = await new Request(url+endpoints[1]).loadString()
              modulePath = fm.joinPath(dir, 'slackModule.js')
              fm.writeString(modulePath, moduleFile)
              throw "Update Complete!"
            } else {
              throw "Update Canceled!"
            }
        }
   } else if (typeof uC === 'number'){
      needUpdate = undefined
   } else if (uC.version = version){
      console.log(">> SCRIPT IS UP TO DATE!")
   }
     
  return {uC, needUpdate}
};

//Exports Functions
module.exports = {
    getFromAPI,
    createGradient,
    infoWidget,
    createHeader,
    addString,
    presentAlert,
    saveImages,
    getImage,
    createIssueNotification,
    createOkNotification,
    updateCheck
};


//=========================================//
//============== END OF MODULE ============//
//=========================================//
