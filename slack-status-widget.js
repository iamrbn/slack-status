// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: hashtag;
// Script is written by iamrbn - GitHub (u/iamrbn → Reddit / iamrbn_ → Twitter)
// Script-URL = https://github.com/iamrbn/slack-status

const scriptURL = 'https://raw.githubusercontent.com/iamrbn/slack-status/main/slack-status-widget.js'
const scriptVersion = 1.1
const bgColor = Color.dynamic(Color.white(), new Color("#481349"));
const txtColor = Color.dynamic(Color.black(), Color.white());
const newDate = new Date();
const dateFormatter = new DateFormatter();
const widgetSize = config.widgetFamily;
const fm = FileManager.iCloud();
const dir = fm.joinPath(fm.documentsDirectory(), "slack-status-widget");
if (!fm.fileExists(dir))fm.createDirectory(dir);

const top = Color.dynamic(new Color('#ffffff'), new Color('#4E1E54'));
const middle = Color.dynamic(new Color('#EDEDED'), new Color('#481C4D'));
const bottom = Color.dynamic(new Color('#D4D4D4'), new Color('#441A49'));
const bgGradient = new LinearGradient()
      bgGradient.locations = [0, 0.4, 1]
      bgGradient.colors = [top, middle, bottom]
      
api = await getFromAPI()
logWarning(JSON.stringify(api, null, 2))

var emoji = " ✅ ";
if (api.status != "ok") {
	this.dateCreated = api.date_created;
	this.dateUpdated = api.date_updated;
	this.dataID = api.active_incidents[0].id;
	this.dateCreated2 = api.active_incidents[0].date_created;
	this.dateUpdated2 = api.active_incidents[0].date_updated;
	this.dataTitle = api.active_incidents[0].title;
	this.dataType = api.active_incidents[0].type;
	this.dataStatus = api.active_incidents[0].status;
	this.dataURL = api.active_incidents[0].url;
	this.dataServices = api.active_incidents[0].services;
	this.dateCreatedBody = api.active_incidents[0].notes[0].date_created;
	this.dataBody = api.active_incidents[0].notes[0].body;

	if (dataType == "incident")emoji = " ⚠️ ";
	else if (dataType == "outage")emoji = " ⛔️ ";
	else if (dataType == "notice")emoji = " 🚩 ";
	else if (dataType == "maintenance")emoji = " 🔧 ";
}

// ############ SETUP SMALL WIDGET ############
async function createSmallWidget(refreshInt) {
  let widget = new ListWidget();
  var widgetURL = "https://status.slack.com"
      widget.url = widgetURL;
      widget.backgroundGradient = bgGradient
      widget.setPadding(5, 1, 3, 1);
  let refreshDate = Date.now() + 1000 * 60 * refreshInt;
      widget.refreshAfterDate = new Date(refreshDate);

  let titleStack = widget.addStack();

      titleStack.addSpacer(7);

  let img = await getImageFor("slackIcon");
  let AppIcon = titleStack.addImage(img).imageSize = new Size(20, 20);

      titleStack.addSpacer(7);
      
  let title = titleStack.addText("Slack Status");
      title.font = new Font("Futura-Medium", 17);

      widget.addSpacer(3);

  let statusImageStack = widget.addStack();
      statusImageStack.centerAlignContent();
      statusImageStack.setPadding(0, 37, 0, 0);

	if (api.status == 'ok') {
		StatusImage = statusImageStack.addImage(await getImageFor(api.status)).imageSize = new Size(77, 77);;
		statusTitle = widget.addText("is up and running 🚀");
		widget.addSpacer(5);
		statusTitle.font = Font.lightSystemFont(12);
		statusTitle.centerAlignText();
		widget.addSpacer(0);
	} else {
		StatusImage = statusImageStack.addImage(await getImageFor(dataType)).imageSize = new Size(77, 77);

		headline = widget.addText("Trouble with");
		headline.textColor = Color.red();
		headline.font = Font.semiboldSystemFont(11);
		headline.centerAlignText();

     statusTitle = widget.addText(String(dataServices).replace(" ", "\n"));
     statusTitle.textColor = Color.red();
     statusTitle.font = Font.semiboldSystemFont(12);
     statusTitle.lineLimit = 3;
     statusTitle.minimumScaleFactor = 0.8;
     statusTitle.centerAlignText();

		widget.addSpacer(0);
	}


  let uCheck = await updateCheck(scriptVersion)
  if (uCheck.version > scriptVersion) {
      line7 = widget.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.lightRoundedSystemFont(11)
      line7.centerAlignText()
      line7.textColor = Color.red()
      widgetURL = 'https://github.com/iamrbn/slack-status/tree/main'
      widget.url = widgetURL
}

      dateFormatter.useShortTimeStyle();
  let footer = widget.addText("Last Refresh " + dateFormatter.string(newDate));
      footer.font = Font.mediumSystemFont(9);
      footer.textOpacity = 0.16;
      footer.centerAlignText();

	return widget;
}

// ########### SETUP MEDIUM WIDGET ###########
async function createMediumWidget(refreshInt) {
  let widget = new ListWidget();
      widget.setPadding(10, 10, 5, 10);
      widget.backgroundGradient = bgGradient
  let refreshDate = Date.now() + 1000 * 60 * refreshInt;
      widget.refreshAfterDate = new Date(refreshDate);

  let titleStack = widget.addStack();
      titleStack.addSpacer(2);
      titleStack.centerAlignContent()

  let img = await getImageFor("slackIcon");
  let AppIcon = titleStack.addImage(img).imageSize = new Size(22, 22);
      AppIcon.url = "slack://";

	titleStack.addSpacer(7);

  let t1 = titleStack.addText("Slack Status");
      t1.font = new Font("Futura-Medium", 19);
      t1.url = "slack://";
      
  let uCheck = await updateCheck(scriptVersion)
     if (uCheck.version > scriptVersion) {
      titleStack.addSpacer(7)
      line7 = titleStack.addText(`Update ${uCheck.version} Available!`)
      line7.font = Font.regularRoundedSystemFont(17)
      line7.url = 'https://github.com/iamrbn/slack-status/tree/main'
      line7.textColor = Color.red()
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

      linkSymbol = SFSymbol.named("safari");
      linkStack = leftStack.addStack();
      linkStack.centerAlignContent();
      linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues";

      linkElement = linkStack.addText("Having trouble? ");
      linkElement.textColor = Color.gray();
      linkElement.font = Font.lightSystemFont(11);
      linkElement.textOpacity = 0.4;

      linkSymbolElement = linkStack.addImage(linkSymbol.image);
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

     linkSymbol = SFSymbol.named("info.circle");
     linkStack = leftStack.addStack();
     linkStack.centerAlignContent();
     linkStack.url = dataURL;
  
     linkSymbolElement = linkStack.addImage(linkSymbol.image);
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
async function createLargeWidget(refreshInt) {
  let widget = new ListWidget();
      widget.backgroundGradient = bgGradient;
      widget.setPadding(10, 15, 5, 10);
  var refreshDate = Date.now() + 1000 * 60 * refreshInt;
      widget.refreshAfterDate = new Date(refreshDate);

	// header of the widget
  let titleStack = widget.addStack();
      titleStack.centerAlignContent();

  var img = await getImageFor("slackIcon");
  let AppIcon = titleStack.addImage(img);
      AppIcon.imageSize = new Size(25, 25);
      AppIcon.url = "slack://";

    	 titleStack.addSpacer(7);

  let t1 = titleStack.addText("Slack Status");
      t1.font = new Font("Futura-Medium", 23);
      t1.url = "slack://";
      
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

		let linkSymbol = SFSymbol.named("safari");
		let linkStack = widget.addStack();
		linkStack.setPadding(0, 103, 0, 0);
		linkStack.centerAlignContent();
		linkStack.url = "https://slack.com/help/articles/205138367-Troubleshoot-connection-issues";

		let linkElement = linkStack.addText("Having trouble? ");
		linkElement.textColor = Color.gray();
		linkElement.font = Font.lightSystemFont(11);
		linkElement.textOpacity = 0.4;

		let linkSymbolElement = linkStack.addImage(linkSymbol.image);
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

     linkSymbol = SFSymbol.named("info.circle");
    	linkStack = widget.addStack();
		linkStack.centerAlignContent();
		linkStack.setPadding(0, 50, 0, 0);
		linkStack.url = dataURL;

		linkElement = linkStack.addText("Read more about " + dataType + " ID " + dataID);
		linkElement.textColor = Color.blue();
		linkElement.font = Font.lightSystemFont(12);

		linkStack.addSpacer(3);

		linkSymbolElement = linkStack.addImage(linkSymbol.image);
		linkSymbolElement.imageSize = new Size(12, 12);
		linkSymbolElement.tintColor = Color.blue();
	}

	widget.addSpacer();

	//List of the single Services
  let mainStack = widget.addStack();
  
  let leftStack = mainStack.addStack();
      leftStack.layoutVertically();
      
  let rightStack = mainStack.addStack();
      rightStack.layoutVertically();

	// ### Line Number 1 ###
  let line1 = widget.addStack();
  let loginStack = line1.addStack();
  let login = loginStack.addText("Login/SSO");
      login.font = Font.lightSystemFont(12);
      loginStack.addSpacer(54);
   if (api.status != "ok" && dataServices.includes("Login/SSO")) statusIcon = loginStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
 else statusIcon = loginStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	loginStack.addSpacer();

	let ConnectionsStack = line1.addStack();
	let Connections = ConnectionsStack.addText("Connections");
       Connections.font = Font.lightSystemFont(12);
       ConnectionsStack.addSpacer(48);
    if (api.status != "ok" && dataServices.includes("Connections")) statusIcon = ConnectionsStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
  else statusIcon = ConnectionsStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	ConnectionsStack.addSpacer();

	// ### Line Number 2 ###
	let line2 = widget.addStack();
	let MessagingStack = line2.addStack();
	let Messaging = MessagingStack.addText("Messaging");
       Messaging.font = Font.lightSystemFont(12);
	MessagingStack.addSpacer(52);
   if (api.status != "ok" && dataServices.includes("Messaging")) statusIcon = MessagingStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
  else statusIcon = MessagingStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	MessagingStack.addSpacer();

	let LinkPreviewStack = line2.addStack();
	let LinkPreview = LinkPreviewStack.addText("Link Previews");
	LinkPreview.font = Font.lightSystemFont(12);
	LinkPreviewStack.addSpacer(43);
    if (api.status != "ok" && dataServices.includes("Link Previews")) statusIcon = LinkPreviewStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = LinkPreviewStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	LinkPreviewStack.addSpacer();

	// ### Line Number 3 ###
	let line3 = widget.addStack();
	let PostsFilesStack = line3.addStack();
	let PostsFiles = PostsFilesStack.addText("Posts/Files");
	PostsFiles.font = Font.lightSystemFont(12);
	PostsFilesStack.addSpacer(53);
    if (api.status != "ok" && dataServices.includes("Posts/Files")) statusIcon = PostsFilesStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = PostsFilesStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	PostsFilesStack.addSpacer();

	let NotificationsStack = line3.addStack();
	let Notifications = NotificationsStack.addText("Notifications");
	Notifications.font = Font.lightSystemFont(12);
	NotificationsStack.addSpacer(48);
    if (api.status != "ok" && dataServices.includes("Notifications")) statusIcon = NotificationsStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = NotificationsStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);
    
	NotificationsStack.addSpacer();

	// ### Line Number 4 ###
	let line4 = widget.addStack();
	let CallsStack = line4.addStack();
	let Calls = CallsStack.addText("Calls");
	Calls.font = Font.lightSystemFont(12);
	CallsStack.addSpacer(85);
    if (api.status != "ok" && dataServices.includes("Calls")) statusIcon = CallsStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = CallsStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	CallsStack.addSpacer();

	let SearchStack = line4.addStack();
	let Search = SearchStack.addText("Search");
       Search.font = Font.lightSystemFont(12);
       SearchStack.addSpacer(79);
   if (api.status != "ok" && dataServices.includes("Search")) statusIcon = SearchStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
   else statusIcon = SearchStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);
    
	SearchStack.addSpacer();

	// ### Line Number 5 ###
	let line5 = widget.addStack();
	let AppsStack = line5.addStack();
	let Apps = AppsStack.addText("Apps/APIs/\nIntegrations");
	Apps.font = Font.lightSystemFont(12);
	AppsStack.addSpacer(46);
    if (api.status != "ok" && dataServices.includes("Apps/Integrations/APIs")) statusIcon = AppsStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = AppsStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	AppsStack.addSpacer();

  let WorkspaceStack = line5.addStack();
  let Workspace = WorkspaceStack.addText("Workspace/Org/\nAdministration");
      Workspace.font = Font.lightSystemFont(12);
      WorkspaceStack.addSpacer(29);
    if (api.status != "ok" && dataServices.includes("Workspace/Org Administration")) statusIcon = WorkspaceStack.addImage(await getImageFor(dataType)).imageSize = new Size(20, 20);
    else statusIcon = WorkspaceStack.addImage(await getImageFor('ok')).imageSize = new Size(20, 20);

	WorkspaceStack.addSpacer();
	widget.addSpacer();

	// shows the last widget update
	dateFormatter.useMediumDateStyle();
	dateFormatter.useShortTimeStyle();

  let footer = widget.addText("Last Widget Refresh " + dateFormatter.string(newDate));
      footer.font = Font.mediumSystemFont(9);
      footer.textOpacity = 0.16;
      footer.centerAlignText();

	return widget;
}

async function createErrorWidget() {
  let widget = new ListWidget();
      widget.backgroundGradient = bgGradient;
  let wTitle = widget.addText("No API Response")
  let wSubtitle = widget.addText("Please ckeck your Internet Connection")
  
  return widget; 
}

//=============================================
//============== FUNCTION AREA ================
//=============================================

// Get from API
async function getFromAPI() {
let api;
try {
let url = 'https://status.slack.com/api/v2.0.0/current'

let req = new Request(url);
    api = await req.loadJSON();
} catch (e) {
  let errWidget = await createErrorWidget()
  await errWidget.presentSmall()
  }
 return api;
}

// widget refresh interval
async function refreshAfter() {
	let refreshInt = await args.widgetParameter;
	if (refreshInt == null) {
		refreshInt = 30; //min
	}
	return refreshInt;
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
}

async function getImageFor(name) {
	img_path = fm.joinPath(dir, name + '.png')
	await fm.downloadFileFromiCloud(img_path);
	img = await fm.readImage(img_path);
  return img;
}

// Runtime images:
await saveImages();
try {saveData(data)}
catch(e) {}

if (config.runsInApp) {
	await presentMenu();
} else if (config.runsInWidget) {
	switch (widgetSize) {
    		case "small":
			widget = await createSmallWidget();
			break;
    		case "medium":
			widget = await createMediumWidget();
			break;
    		case "large":
			widget = await createLargeWidget();
			break;
    		default:
			widget = await createMediumWidget();
	}
	Script.setWidget(widget);
}

async function presentMenu() {
	let alert = new Alert(api);
	alert.title = "Slack Status Widget";
	alert.message = emoji + ' "' + api.status.toUpperCase() + '" ' + emoji;
	alert.addAction("Small");
	alert.addAction("Medium");
	alert.addAction("Large");
	alert.addDestructiveAction("Web Dashboard ↗");
	alert.addCancelAction("Cancel");
	let idx = await alert.presentSheet(api);
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
		Safari.openInApp("https://status.slack.com");
	}
}

async function updateCheck(version) {
  let uC;
 try {
  let updateCheck = new Request(`${scriptURL}on`)
    uC = await updateCheck.loadJSON()
 } catch (e) {return log(e)}
  
  log(uC)
  
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
}

//============================================
//============== END OF SCRIPT ===============
//============================================
