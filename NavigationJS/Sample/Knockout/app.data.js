var mails = [
	{ "id": 1, "from": "Abbot \u003coliver@smoke-stage.xyz\u003e", "to": "steve@example.com", "date": "May 25, 2011", "subject": "Booking confirmation #389629244", "folder": "Inbox" },
	{ "id": 2, "from": "Addison Begoat \u003cupton.oprdrusson@pear-income.xyz\u003e", "to": "steve@example.com", "date": "May 7, 2011", "subject": "FW: Associate advice", "folder": "Inbox" },
	{ "id": 3, "from": "Allistair \u003cleroy72@plane-railway.xyz\u003e", "to": "steve@example.com", "date": "May 19, 2011", "subject": "RE: Phone call tomorrow 5 o\u0027clock", "folder": "Inbox" },
	{ "id": 4, "from": "emmanuel26@ghost.xyz", "to": "steve@example.com", "date": "May 22, 2011", "subject": "Completing basketball project", "folder": "Inbox" },
	{ "id": 5, "from": "jamalia.alnismith1@twigdad.xyz", "to": "steve@example.com", "date": "Apr 26, 2011", "subject": "FW: Can you get DE to resubmit accounts?", "folder": "Inbox" },
	{ "id": 6, "from": "lionel.qugy@cribsmoke.xyz", "to": "steve@example.com", "date": "May 22, 2011", "subject": "RE: Catch up at 9:00 to finalise rain spec", "folder": "Inbox" },
	{ "id": 7, "from": "Madison Lalinesson \u003cmelinda.gofagy@wing-language2.xyz\u003e", "to": "steve@example.com", "date": "May 19, 2011", "subject": "RE: Pencil scenarios", "folder": "Inbox" },
	{ "id": 8, "from": "rajah.nukripyford@cast92.xyz", "to": "steve@example.com", "date": "Apr 28, 2011", "subject": "Flavor benefit gig", "folder": "Inbox" },
	{ "id": 9, "from": "Sandra Juanhison \u003cyoshi.mostaline72@facefruit.xyz\u003e", "to": "steve@example.com", "date": "May 8, 2011", "subject": "RE: Apparel5 network is back up", "folder": "Inbox" },
	{ "id": 10, "from": "Sylvester \u003crose.va@bunpig98.xyz\u003e", "to": "steve@example.com", "date": "May 1, 2011", "subject": "Feedback requested by Ayanna Nuyo", "folder": "Inbox" },
	{ "id": 11, "from": "veronica@heart.xyz", "to": "steve@example.com", "date": "May 4, 2011", "subject": "Project Book starting 6pm", "folder": "Inbox" },
	{ "id": 12, "from": "XLN \u003cbasia@framehome.xyz\u003e", "to": "steve@example.com", "date": "May 8, 2011", "subject": "RE: Remember Whoopi\u0027s joke", "folder": "Inbox" },
	{ "id": 13, "from": "adele.guyuson@hat-chicken6.xyz", "to": "steve@example.com", "date": "May 2, 2011", "subject": "RE: Reservation confirmation #999331516", "folder": "Archive" },
	{ "id": 14, "from": "blair@pleasure-cactus77.xyz", "to": "steve@example.com", "date": "May 24, 2011", "subject": "Project Sky  - your job is 9pm", "folder": "Archive" },
	{ "id": 15, "from": "brennan@lake.xyz", "to": "steve@example.com", "date": "May 20, 2011", "subject": "RE: Car9 network is out of service", "folder": "Archive" },
	{ "id": 16, "from": "BYLB \u003ctravis98@downtown28.xyz\u003e", "to": "steve@example.com", "date": "May 20, 2011", "subject": "RE: Pear tactics", "folder": "Archive" },
	{ "id": 17, "from": "catherine85@fanhope14.xyz", "to": "steve@example.com", "date": "May 6, 2011", "subject": "Meet with Camilla", "folder": "Archive" },
	{ "id": 18, "from": "channing11@moon26.xyz", "to": "steve@example.com", "date": "May 13, 2011", "subject": "Meeting at 9am", "folder": "Archive" },
	{ "id": 19, "from": "clio.gucysmith@pailmountain.xyz", "to": "steve@example.com", "date": "May 2, 2011", "subject": "Your order P815875237 has dispatched", "folder": "Archive" },
	{ "id": 20, "from": "erich.grizajuson7@volleyball-icicle.xyz", "to": "steve@example.com", "date": "May 23, 2011", "subject": "Reservation confirmation #439756385", "folder": "Archive" },
	{ "id": 21, "from": "fitzgerald.togoag@bike.xyz", "to": "steve@example.com", "date": "May 24, 2011", "subject": "Feedback requested by Bradley Vasedrismith", "folder": "Archive" },
	{ "id": 22, "from": "harriet1@pear-daughter.xyz", "to": "steve@example.com", "date": "Apr 30, 2011", "subject": "RE: Hall server is back up", "folder": "Archive" },
	{ "id": 23, "from": "Ila \u003craja@quiet.xyz\u003e", "to": "steve@example.com", "date": "May 14, 2011", "subject": "RE: Your order A435146969 is delayed", "folder": "Archive" },
	{ "id": 24, "from": "Kareem Wyeson \u003canne56@crayon21.xyz\u003e", "to": "steve@example.com", "date": "May 16, 2011", "subject": "FW: Straw diagrams", "folder": "Archive" },
	{ "id": 25, "from": "keith2@hope.xyz", "to": "steve@example.com", "date": "May 14, 2011", "subject": "Operation Island finished", "folder": "Archive" },
	{ "id": 26, "from": "lev.vopiyosson@dirt-crown.xyz", "to": "steve@example.com", "date": "May 3, 2011", "subject": "RE: DB Replication ending now", "folder": "Archive" },
	{ "id": 27, "from": "melinda.atla@string-hall94.xyz", "to": "steve@example.com", "date": "May 18, 2011", "subject": "have clinic appt at 5:45", "folder": "Archive" },
	{ "id": 28, "from": "Richard \u003cfiona2@wrench.xyz\u003e", "to": "steve@example.com", "date": "May 4, 2011", "subject": "Beam5 network is back up", "folder": "Archive" },
	{ "id": 29, "from": "sean.mayel@string37.xyz", "to": "steve@example.com", "date": "May 7, 2011", "subject": "Feedback requested by Dawn Pytosson", "folder": "Archive" },
	{ "id": 30, "from": "Simone \u003croary@bushes.xyz\u003e", "to": "steve@example.com", "date": "May 9, 2011", "subject": "RE: Does Nolan know C#?", "folder": "Archive" },
	{ "id": 31, "from": "thaddeus.tregube5@butter coast.xyz", "to": "steve@example.com", "date": "May 18, 2011", "subject": "RE: Remember Chava\u0027s brother", "folder": "Archive" },
	{ "id": 32, "from": "zenia.dayson@pail-apparel8.xyz", "to": "steve@example.com", "date": "May 11, 2011", "subject": "RE: Reviewing VHD demo", "folder": "Archive" },
	{ "id": 33, "from": "steve@example.com", "to": "callum.wyeslyfa@fang ghost.xyz", "date": "May 13, 2011", "subject": "RE: Logo ideas", "folder": "Sent" },
	{ "id": 34, "from": "steve@example.com", "to": "camilla.qusesson@visitor.xyz", "date": "May 6, 2011", "subject": "RE: Yo", "folder": "Sent" },
	{ "id": 35, "from": "steve@example.com", "to": "claudia3@team87.xyz", "date": "May 3, 2011", "subject": "RE: Out at doctor", "folder": "Sent" },
	{ "id": 36, "from": "steve@example.com", "to": "felix.ultiford@grape.xyz", "date": "May 17, 2011", "subject": "See you Tuesday 1pm", "folder": "Sent" },
	{ "id": 37, "from": "steve@example.com", "to": "Geraldine Yoro \u003ctashya.qupaansson@boundarysummer.xyz\u003e", "date": "Apr 30, 2011", "subject": "Rain meet-up", "folder": "Sent" },
	{ "id": 38, "from": "steve@example.com", "to": "Hedda \u003ckameko.antreoprsmith@pancakehook.xyz\u003e", "date": "May 1, 2011", "subject": "RE: Associates tactics meeting: 4:30", "folder": "Sent" },
	{ "id": 39, "from": "steve@example.com", "to": "Ingrid \u003cglenna.ni96@plastic.xyz\u003e", "date": "May 14, 2011", "subject": "RE: Reservation confirmation #763296484", "folder": "Sent" },
	{ "id": 40, "from": "steve@example.com", "to": "Isaac \u003crooney.steson@cattle-spy21.xyz\u003e", "date": "May 14, 2011", "subject": "Employee benefits policy", "folder": "Sent" },
	{ "id": 41, "from": "steve@example.com", "to": "MFHV \u003cheather84@seed.xyz\u003e", "date": "May 25, 2011", "subject": "FW: Gate server is out of service", "folder": "Sent" },
	{ "id": 42, "from": "steve@example.com", "to": "Noel Coford \u003ccolt.wyeline53@frame.xyz\u003e", "date": "May 2, 2011", "subject": "RE: Territory event", "folder": "Sent" },
	{ "id": 43, "from": "steve@example.com", "to": "Roanna \u003celizabeth.griwasi36@railwayjuice.xyz\u003e", "date": "Apr 27, 2011", "subject": "Operation Horse ending 8pm", "folder": "Sent" },
	{ "id": 44, "from": "Vance \u003csigne64@wilderness.xyz\u003e", "to": "steve@example.com", "date": "May 4, 2011", "subject": "@@ Meet new friends online @@", "folder": "Spam" },
	{ "id": 45, "from": "aiko.ossmith@cake-cannon.xyz", "to": "steve@example.com", "date": "May 16, 2011", "subject": "Samuel\u0027s n0se is perfect - fix yours t0day", "folder": "Spam" },
	{ "id": 46, "from": "Anne \u003cbrenda.fube@space-father.xyz\u003e", "to": "steve@example.com", "date": "May 4, 2011", "subject": "you\u0027re meds order #Y555764626", "folder": "Spam" },
	{ "id": 47, "from": "baker.tometo7@road-plantation.xyz", "to": "steve@example.com", "date": "Apr 29, 2011", "subject": "Does ZZX excuse the trail?", "folder": "Spam" },
	{ "id": 48, "from": "brennan.linexetresson@sleet57.xyz", "to": "steve@example.com", "date": "May 6, 2011", "subject": "FREE iPAD 2 GUARANTEED", "folder": "Spam" },
	{ "id": 49, "from": "Charlotte \u003ckasimir@wrenchmarble4.xyz\u003e", "to": "steve@example.com", "date": "May 7, 2011", "subject": "no other product can help", "folder": "Spam" },
	{ "id": 50, "from": "Deanna Wridaypa \u003cluke.pytocooson@mitten.xyz\u003e", "to": "steve@example.com", "date": "May 1, 2011", "subject": "!!Winner!! Place first 1000USD bet free", "folder": "Spam" },
	{ "id": 51, "from": "Hamilton Yueehi \u003cjameson.yuhapa@income-family.xyz\u003e", "to": "steve@example.com", "date": "May 10, 2011", "subject": "2 unread message(s): Hello Taylor", "folder": "Spam" },
	{ "id": 52, "from": "hasad.lineeesson1@camp-stew.xyz", "to": "steve@example.com", "date": "May 20, 2011", "subject": "March United Bank Inc", "folder": "Spam" },
	{ "id": 53, "from": "HGLF \u003canastasia7@tree-hook.xyz\u003e", "to": "steve@example.com", "date": "May 4, 2011", "subject": "YouPharmacy5 special offer: 80% off this week only", "folder": "Spam" },
	{ "id": 54, "from": "Isabella Hasmith \u003clinda.tocoovaford@bedroomcactus6.xyz\u003e", "to": "steve@example.com", "date": "Apr 27, 2011", "subject": "Ticket confirmation #484993598", "folder": "Spam" },
	{ "id": 55, "from": "jackson.passon@frogbreakfast.xyz", "to": "steve@example.com", "date": "May 7, 2011", "subject": "УДВОЕНИЕ СКОРОСТИ ЧТЕНИЯ ЗА 3 ЧАСА", "folder": "Spam" },
	{ "id": 56, "from": "leandra@advice.xyz", "to": "steve@example.com", "date": "May 7, 2011", "subject": "Stunning replica watches", "folder": "Spam" },
	{ "id": 57, "from": "russell.drison@cannoncoast1.xyz", "to": "steve@example.com", "date": "May 26, 2011", "subject": "RE: Hi Murphy...", "folder": "Spam" },
	{ "id": 58, "from": "william.boam@throat-horn.xyz", "to": "steve@example.com", "date": "May 16, 2011", "subject": "An exclusive offer from your bank", "folder": "Spam" },
	{ "id": 59, "from": "zephania.va@crookvolcano55.xyz", "to": "steve@example.com", "date": "May 5, 2011", "subject": "Днепропетровск", "folder": "Spam" },
	{ "id": 60, "from": "ZK \u003cjoshua@sun-money.xyz\u003e", "to": "steve@example.com", "date": "May 12, 2011", "subject": "Somebody invited you to join eReaders Community", "folder": "Spam" }
]
function getMails(folder){
	var items = [];
	for (var i = 0; i < mails.length; i++) {
		if (mails[i].folder === folder)
			items.push(mails[i]);
	}
	return { mails: items };
}
function getMail(mailId) {
	for (var i = 0; i < mails.length; i++) {
		if (mails[i].id === mailId) {
			mails[i].messageContent = '';
			return mails[i];
		}
	}
	return null;
}