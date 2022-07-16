// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: hashtag;
// Script is written by iamrbn - GitHub (u/iamrbn → Reddit, iamrbn_ → Twitter)
// Script = https://github.com/iamrbn/slack-status

const scriptURL = 'https://raw.githubusercontent.com/iamrbn/slack-status/main/slack-status-widget.js'
const scriptVersion = '1.2'
const bgColor = Color.dynamic(Color.white(), new Color("#481349"));
const txtColor = Color.dynamic(Color.black(), Color.white());
const newDate = new Date();
const dateFormatter = new DateFormatter();
const widgetSize = config.widgetFamily;
const fm = FileManager.iCloud();
const dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget");
if (!fm.fileExists(dir)) fm.createDirectory(dir);
const getStatusNotifications = true;
const nKey = Keychain
const top = Color.dynamic(new Color('#ffffff'), new Color('#4E1E54'));
const middle = Color.dynamic(new Color('#EDEDED'), new Color('#481C4D'));
const bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#441A49'));
const bgGradient = new LinearGradient();
      bgGradient.locations = [0, 0.4, 1];
      bgGradient.colors = [top, middle, bottom];     

let nParameter = await args.notification;
let refreshInt = await args.widgetParameter;
if (refreshInt == null) refreshInt = 30; //in minutes

let api;
try {    
    api = await new Request('https://status.slack.com/api/v2.0.0/current').loadJSON(); 
      noInternet = false;
      emoji = " ✅ ";
      if (api.status != "ok") {
      dateCreated = api.date_created;
      dateUpdated = api.date_updated;
      dataID = api.active_incidents[0].id;
      dateCreated2 = api.active_incidents[0].date_created;
      dateUpdated2 = api.active_incidents[0].date_updated;
      dataTitle = api.active_incidents[0].title;
      dataType = api.active_incidents[0].type;
      dataStatus = api.active_incidents[0].status;
      dataURL = api.active_incidents[0].url;
      dataServices = api.active_incidents[0].services;
      dateCreatedBody = api.active_incidents[0].notes[0].date_created;
      dataBody = api.active_incidents[0].notes[0].body;

  if (dataType == "incident" || "active") emoji = " ⚠️ ";
  else if (dataType == "outage") emoji = " ⛔️ ";
  else if (dataType == "notice") emoji = " 🚩 ";
  else if (dataType == "maintenance") emoji = " 🔧 ";
  };
} catch (e) {
    logError(e);
    noInternet = true;
    if (config.runsInApp) await presentAlert(String(e));
};
      
if (config.runsInApp && !noInternet) {
	await presentMenu();
} else if (config.runsInWidget) {
  switch (widgetSize) {
    	case "small":
        if (noInternet) widget = await createErrorWidget(10);
        else widget = await createSmallWidget();
	break;
    	case "medium":
        if (noInternet) widget = await createErrorWidget(20);
        else widget = await createMediumWidget();
	break;
    	case "large":
        if (noInternet) widget = await createErrorWidget(25);
    	   else widget = await createLargeWidget();
	break;
    	default:
             widget = await createErrorWidget();
	}
	Script.setWidget(widget);
} else if (config.runsInNotification) QuickLook.present(await getImageFor(nParameter.userInfo.imgName));

if (!nKey.contains("current_issue")) nKey.set("current_issue", api.date_updated);
log(nKey.get("current_issue"));
if (getStatusNotifications) {
if (nKey.get("current_issue") != api.date_updated && api.status != 'ok') createIssueNotification();
else if (nKey.get("current_issue") != api.date_updated && api.status == 'ok') createOkNotification();
};


// ############ SETUP SMALL WIDGET ############
async function createSmallWidget() {
  let widget = new ListWidget();
      widget.url = "https://status.slack.com";
      widget.backgroundGradient = bgGradient
      widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt);

  await createHeader(widget, 20, 17)

      widget.addSpacer(3);

	if (api.status == 'ok') {
		statusImage = widget.addImage(await getImageFor(api.status));
        statusTitle = widget.addText("is up and running");
		widget.addSpacer();
	} else {
		statusImage = widget.addImage(await getImageFor(dataType));
		headline = widget.addText("Trouble with");
		headline.textColor = Color.red();
		headline.font = Font.semiboldSystemFont(11);
		headline.centerAlignText();

        statusTitle = widget.addText(String(dataServices).replace(" ", "\n"));
        statusTitle.textColor = Color.red();
        statusTitle.lineLimit = 3;
        statusTitle.minimumScaleFactor = 0.8;
	};
  
        statusImage.imageSize = new Size(77, 77);  
        statusImage.centerAlignImage();
  
        statusTitle.font = Font.lightSystemFont(12);  
        statusTitle.centerAlignText();

  let uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      updateInfo = widget.addText(`Update ${uCheck.version} Available!`)
      updateInfo.font = Font.lightRoundedSystemFont(11)
      updateInfo.centerAlignText()
      updateInfo.textColor = Color.red()
      widgetURL = 'https://github.com/iamrbn/slack-status/tree/main'
      widget.url = "https://status.slack.com"
}

      dateFormatter.useShortTimeStyle();
  let footer = widget.addText("Last Update " + dateFormatter.string(new Date()));
      footer.font = Font.mediumSystemFont(9);
      footer.textOpacity = 0.16;
      footer.centerAlignText();

	return widget;
};

// ########### SETUP MEDIUM WIDGET ###########
async function createMediumWidget() {
  let widget = new ListWidget();
      widget.setPadding(10, 10, 5, 10);
      widget.backgroundGradient = bgGradient
      widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt);

  await createHeader(widget, 25, 25);

  let uCheck = await updateCheck(scriptVersion)
     if (uCheck.version > scriptVersion) {
      titleStack.addSpacer(10)
      line7 = titleStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.regularRoundedSystemFont(10)
      line7.url = 'https://github.com/iamrbn/slack-status/tree/main'
      line7.textColor = Color.red()
      line7.leftAlignText()
      widget.url = 'https://github.com/iamrbn/slack-status/tree/main'
}

	widget.addSpacer();

  let mainStack = widget.addStack();

	// Left stack contains the status text
  let leftStack = mainStack.addStack();
      leftStack.layoutVertically();

	// Right stack contains the status icon
  let rightStack = mainStack.addStack();
      rightStack.layoutVertically();

	if (api.status == 'ok') {
      rightStack.setPadding(0, 30, 15, 0);
      leftStack.setPadding(0, 10, 0, 0);

      leftStack.addSpacer(25);

      statusTitle = leftStack.addText("Slack is up and running 🚀");
      statusTitle.font = Font.lightSystemFont(14);

      leftStack.addSpacer(7);

      linkStack = leftStack.addStack();
      linkStack.centerAlignContent();
      linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues";

      linkElement = linkStack.addText("Having trouble? ");
      linkElement.textColor = Color.gray();
      linkElement.font = Font.lightSystemFont(11);
      linkElement.textOpacity = 0.4;

      linkSymbolElement = linkStack.addImage(SFSymbol.named("safari").image);
      linkSymbolElement.imageSize = new Size(12, 12);
      linkSymbolElement.tintColor = Color.gray();
      linkSymbolElement.imageOpacity = 0.2;
      
      StatusImage = rightStack.addImage(await getImageFor('ok'));
      StatusImage.url = "https://status.slack.com";
	} else {
		StatusImage = rightStack.addImage(await getImageFor(dataType));

		StatusImage.url = dataURL;
		leftStack.setPadding(0, 5, 0, 0);
		rightStack.setPadding(0, 5, 5, 0);

		widget.addSpacer(7);

		apiTitle = leftStack.addText(dataTitle);
		apiTitle.font = Font.boldSystemFont(12);
		apiTitle.textColor = Color.red();
		apiTitle.lineLimit = 2;
		apiTitle.minimumScaleFactor = 0.5;

		leftStack.addSpacer(3);

		apiBody = leftStack.addText(dataBody);
		apiBody.font = Font.lightSystemFont(12);
		apiBody.minimumScaleFactor = 0.6;
		apiBody.textColor = Color.red();

		leftStack.addSpacer(3);

     linkStack = leftStack.addStack();
     linkStack.centerAlignContent();
     linkStack.url = dataURL;
  
     linkSymbolElement = linkStack.addImage(SFSymbol.named("info.circle").image);
     linkSymbolElement.imageSize = new Size(9, 9);
     linkSymbolElement.tintColor = Color.blue();
  
     linkStack.addSpacer(3);

		linkElement = linkStack.addText("Read more about " + dataType + " ID " + dataID);
     linkElement.textColor = Color.blue();
     linkElement.font = new Font("PingFangTC-Thin", 10);
	}

      dateFormatter.useShortDateStyle();
      dateFormatter.useShortTimeStyle();

  let footer = widget.addText("Last Widget Refresh " + dateFormatter.string(newDate));
      footer.font = Font.mediumSystemFont(9);
      footer.textOpacity = 0.16;
      footer.centerAlignText();

	return widget;
}


// ############ SETUP LARGE WIDGET ##############
async function createLargeWidget() {
  let widget = new ListWidget();
      widget.backgroundGradient = bgGradient;
      widget.setPadding(15, 15, 5, 15);
      widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * refreshInt);
      
      await createHeader(widget, 25, 23)

  let uCheck = await updateCheck(scriptVersion)
     if (uCheck.version > scriptVersion) {
      titleStack.addSpacer(7)
      line7 = titleStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.regularRoundedSystemFont(14)
      line7.url = 'https://github.com/iamrbn/slack-status/tree/main'
      line7.textColor = Color.red()
      widget.url = 'https://github.com/iamrbn/slack-status/tree/main'
}
      widget.addSpacer();

	// content of the widget
	if (api.status == 'ok') {
		widget.addSpacer();
		StatusImage = widget.addImage(await getImageFor("ok"));

		widget.addSpacer();

		StatusImage.centerAlignImage();
		StatusImage.imageSize = new Size(77, 77);
		StatusImage.url = "https://status.slack.com";
		statusTitle = widget.addText("Slack is up and running 🚀");
		statusTitle.font = new Font("Futura-Medium", 17);

		widget.addSpacer(5);

		let linkStack = widget.addStack();
		linkStack.setPadding(0, 103, 0, 0);
		linkStack.centerAlignContent();
		linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues";

		let linkElement = linkStack.addText("Having trouble? ");
		linkElement.textColor = Color.gray();
		linkElement.font = Font.lightSystemFont(11);
		linkElement.textOpacity = 0.4;

		let linkSymbolElement = linkStack.addImage(SFSymbol.named("safari").image);
		linkSymbolElement.imageSize = new Size(12, 12);
		linkSymbolElement.tintColor = Color.gray();
		linkSymbolElement.imageOpacity = 0.2;

		statusTitle.font = new Font("Futura-Medium", 17);
		statusTitle.centerAlignText();
		widget.addSpacer();
} else {
		StatusImage = widget.addImage(await getImageFor(dataType));
		StatusImage.imageSize = new Size(77, 77);
		StatusImage.centerAlignImage();
		StatusImage.url = dataURL;

		apiTitle = widget.addText(dataTitle);
		apiTitle.font = Font.semiboldSystemFont(14);
		apiTitle.minimumScaleFactor = 0.5;
		apiTitle.textColor = Color.red();
		apiTitle.centerAlignText();
		apiTitle.lineLimit = 2;

		widget.addSpacer(3);

		apiBody = widget.addText(dataBody);
		apiBody.font = Font.lightSystemFont(10);
		apiBody.minimumScaleFactor = 0.7;
		apiBody.textColor = Color.red();
		apiBody.centerAlignText();

    	linkStack = widget.addStack();
		linkStack.centerAlignContent();
		linkStack.setPadding(0, 50, 0, 0);
		linkStack.url = dataURL;

		linkElement = linkStack.addText("Read more about " + dataType + " ID " + dataID);
		linkElement.textColor = Color.blue();
		linkElement.font = Font.lightSystemFont(12);

		linkStack.addSpacer(3);

		linkSymbolElement = linkStack.addImage(SFSymbol.named("info.circle").image);
		linkSymbolElement.imageSize = new Size(12, 12);
		linkSymbolElement.tintColor = Color.blue();
	}

	widget.addSpacer();
  
  await addString(widget, "Login/SSO", "Connections");
  await addString(widget, "Messaging", "Link Previews");
  await addString(widget, "Posts/Files", "Notifications");
  await addString(widget, "Calls", "Search");
  await addString(widget, "Apps/APIs/\nIntegrations", "Workspace/Org/\nAdministration");

	widget.addSpacer();

	// shows the last widget update
	dateFormatter.useMediumDateStyle();
	dateFormatter.useShortTimeStyle();
  let footer = widget.addText("Last Widget Refresh " + dateFormatter.string(newDate));
      footer.font = Font.mediumSystemFont(9);
      footer.textOpacity = 0.16;
      footer.centerAlignText();

	return widget;
};

async function createErrorWidget(pddng) {
  let errWidget = new ListWidget();
      errWidget.setPadding(pddng, pddng, pddng, pddng);
      errWidget.backgroundGradient = bgGradient;
      errWidget.addImage(await getImageFor("sadSlackBot-badConnection")).cornerRadius = 20;
      errWidget.addSpacer();
      wTitle = errWidget.addText("No API Response").font = Font.headline();
      wSubtitle = errWidget.addText("Please ckeck your internet connection").font = Font.subheadline();
  return errWidget;
};

//=============================================
//============== FUNCTION AREA ================
//=============================================

function createIssueNotification() {
 let notify = new Notification();
     notify.title = `Slack ${api.active_incidents[0].type}`.toUpperCase();
     notify.subtitle = `Trouble with: ${api.active_incidents[0].services}`;
     notify.openURL = api.active_incidents[0].url;
     notify.body = api.active_incidents[0].notes[0].body;
     notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com");
     notify.addAction("Show " + api.active_incidents[0].type + " ID " + api.active_incidents[0].id, api.active_incidents[0].url, true);
     notify.identifier = `ID_${api.active_incidents[0].id}`;
     notify.threadIdentifier = Script.name();
     notify.preferredContentHeight = 77;
     notify.scriptName = Script.name();
     notify.userInfo = {"imgName":dataType};
     notify.schedule();
    
  nKey.set("current_issue", api.date_updated);
};

function createOkNotification() {
 let notify = new Notification();
     notify.title = "Slack is now running again";
     notify.subtitle = "Trouble has been solved";
     notify.identifier = api.date_updated;
     notify.threadIdentifier = Script.name();
     notify.addAction("Open Web-Dashboard ↗", "https://status.slack.com");
     notify.scriptName = Script.name();
     notify.preferredContentHeight = 77;
     notify.userInfo = {"imgName":'ok'};
     notify.schedule();
    
  nKey.set("current_issue", api.date_updated);
};


async function createHeader(w, iSize, fSize) {
   headerStack = w.addStack();
   headerStack.centerAlignContent();
   headerStack.url = "slack://";
   headerStack.spacing = 7

   headerIcon = headerStack.addImage(await getImageFor("slackIcon")).imageSize = new Size(iSize, iSize);
   //headerStack.addSpacer(7);
   headerTitle = headerStack.addText("Slack Status").font = new Font("Futura-Medium", fSize);
};

async function addString(widget, leftText, rightText) {
  let line = widget.addStack();
      line.spacing = 15;

  let firstStack = line.addStack();
      firstStack.centerAlignContent()
      firstStack.addText(leftText).font = Font.lightSystemFont(12);
      firstStack.addSpacer();
  if (api.status != 'ok' && dataServices.includes(leftText)) image = dataType;
  else image = 'ok';
      firstStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20)
      
  let secondStack = line.addStack();
      secondStack.centerAlignContent()
      secondStack.addText(rightText).font = Font.lightSystemFont(12);
      secondStack.addSpacer();
  if (api.status != 'ok' && dataServices.includes(rightText)) image = dataType;
  else image = 'ok';
      secondStack.addImage(await getImageFor(image)).imageSize = new Size(20, 20);
};

async function presentAlert(message) {
  let alert = new Alert();
      alert.title = "No Api Response";
      alert.message = message;
      alert.addAction("OK");
      idx = await alert.present();
  //if (idx == 0) Safari.open("prefs:root");
}

// LOADING AND SAVING IMAGES FROM URL TO FOLDER
const imgURL = "https://raw.githubusercontent.com/iamrbn/slack-status/main/Symbols/";
async function saveImages() {
	console.log("loading & saving images");
	var imgs = ["slackIcon.png", "ok.png", "incident.png", "outage.png", "notice.png", "maintenance.png"];
	for (img of imgs) {
		let img_path = fm.joinPath(dir, img);
		if (!fm.fileExists(img_path)) {
			console.log("Loading image: " + img);
			let request = new Request(imgURL + img);
			image = await request.loadImage();
			fm.writeImage(img_path, image);
		}
	}
};

async function getImageFor(name) {
	imgPath = fm.joinPath(dir, name + '.png')
	await fm.downloadFileFromiCloud(imgPath);
	img = await fm.readImage(imgPath);
  return img;
};

// Runtime images:
await saveImages();
try {saveData(data)}
catch(e) {}

async function presentMenu() {
	let alert = new Alert();
	alert.title = "Slack Status";
	alert.message = emoji + api.status.toUpperCase() + emoji;
	alert.addAction("Small");
	alert.addAction("Medium");
	alert.addAction("Large");
     //alert.addAction("Error Widget");
	alert.addDestructiveAction("Web Dashboard ↗");
	alert.addCancelAction("Cancel");
	let idx = await alert.present();
	if (idx == 0) {
		let widget = await createSmallWidget();
		await widget.presentSmall();
	} else if (idx == 1) {
		let widget = await createMediumWidget();
		await widget.presentMedium();
	} else if (idx == 2) {
		let widget = await createLargeWidget();
		await widget.presentLarge();
   } else if (idx == 3) {
     widget = await createErrorWidget(20);
     await widget.presentMedium();
	} else if (idx == 4) Safari.openInApp("https://status.slack.com", false);
};

async function updateCheck(version) {
  let uC;
 try {
  let updateCheck = new Request(`${scriptURL}on`)
    uC = await updateCheck.loadJSON()
 } catch (e) {return log(e)}
  
  log(uC);
  
  let needUpdate = false
  if (uC.version != version) {
      needUpdate = true
      console.warn(`Server Version ${uC.version} Available!`)
    if (!config.runsInWidget) {
      let newAlert = new Alert()
          newAlert.title = `Server Version ${uC.version} Available!`
          newAlert.addAction("OK")
          newAlert.addDestructiveAction("Later")
          newAlert.message="Changes:\n" + uC.notes + "\n\nPress OK to get the update from GitHub"
      if (await newAlert.present() == 0) {
        let req = new Request(scriptURL)
        let updatedCode = await req.loadString()
        let fm = FileManager.iCloud()
        let path = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        log(path)
        fm.writeString(path, updatedCode)
        throw new Error("Update Complete!")
      }
    }
  } else {log("up to date")}

  return needUpdate, uC;
};

//============================================
//============== END OF SCRIPT ===============
//============================================
