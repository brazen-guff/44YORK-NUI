(function(){
"use strict";
"use strict";


		console.log("::LOADING 44YORK CUSTOM::");

		var app = angular.module('viewCustom', ['angularLoad', 'reportProblem', 'googleAnalytics']).run (function($rootScope){
		});;
		
	
		// Begin BrowZine - Primo Integration...
		window.browzine = {
			api: "https://public-api.thirdiron.com/public/v1/libraries/565",
			apiKey: "ba4a928c-2968-42f3-b9f8-11a8990b6914",

			journalCoverImagesEnabled: true,

			journalBrowZineWebLinkTextEnabled: true,
			journalBrowZineWebLinkText: "View Journal Contents",

			acticleBrowZineWebLinkTextEnabled: true,
			articleBrowZineWebLinkText: "View Issue Contents",

			articlePDFDownloadLinkEnabled: true,
			articlePDFDownloadLinkText: "Download PDF",

			articleLinkEnabled: true,
			articleLinkText: "Read Article",

			printRecordsIntegrationEnabled: true,

			unpaywallEmailAddressKey: "enter-your-email@your-institution-domain.edu",

			articlePDFDownloadViaUnpaywallEnabled: true,
			articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall.org)",

			articleLinkViaUnpaywallEnabled: true,
			articleLinkViaUnpaywallText: "Read Article (via Unpaywall.org)",

			articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
			articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall.org)",

			articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
			articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall.org)"

		};

		browzine.script = document.createElement("script");
		browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
		document.head.appendChild(browzine.script);

		
		//************************** remove the below block as part of disabling book takeaway**********************//
		//retrieve username for book takeaway
		app.controller('prmUserAreaExpandableAfterController', function ($scope, $rootScope) {
		    $rootScope.name = this.parentCtrl.userSessionManagerService.getUserName();
		 });
		
		app.component('prmUserAreaExpandableAfter', {
			bindings: { parentCtrl: '<' },
			controller: 'prmUserAreaExpandableAfterController'
		});
		//*******************************end remove block ************************************************************//

		
		
		
		//main book takeaway section
		//********************replace the following component/controller with the below to remove book takeaway but preseve Browzine integration***********************************//
			//  app.controller('prmSearchResultAvailabilityLineAfterController', function($scope) {
			//window.browzine.primo.searchResult($scope);
		    //});
		 
		    //app.component('prmSearchResultAvailabilityLineAfter', {
		   // bindings: { parentCtrl: '<' },
		   // controller: 'prmSearchResultAvailabilityLineAfterController'
		   //});
		

		app.controller('prmSearchResultAvailabilityLineAfterController', function ($scope) {

			window.browzine.primo.searchResult($scope);
		
			}
		);
		
		
		app.component('prmSearchResultAvailabilityLineAfter', {
			bindings: { parentCtrl: '<',
				buttonText: '@',
				buttonLink: '@',
				formURL: '@' ,
				Requestable: '@',
				Show: '@'},
			controller: 'prmSearchResultAvailabilityLineAfterController',
			
			template: '\n <div ng-If="$ctrl.ShowReqLink && $ctrl.Requestable" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\n          <span class="margin-right-small"></span>\n          <a ng-href="{{$ctrl.formURL}}" target="_blank">\n              <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme" type="button" aria-label={{$ctrl.buttonText}} style="color: #00546E;">\n                  <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_description_24px"></prm-icon>\n                  <span style="text-transform: none;">{{$ctrl.serviceText}}</span>\n              </button>\n          </a>\n      </div>'
			

		});
		
		
		app.controller('prmSearchResultAvailabilityLineAfterController', function ($scope, $rootScope, $location) {
			
			window.browzine.primo.searchResult($scope);

			//test whether item is available in physical form - any electronic delcategory means that 
			//the request link shouldn't appear

			//set local scope userID to value from rootScope
			$scope.userID = $rootScope.name;
			
			var vm = this;
									
			//are we on a fulldisplay page? If so, proceed
			//if not, we are on a results page so none of the following is relevant
			vm.showLocations = ['/fulldisplay', '/openurl'];
			vm.Show = vm.showLocations.includes($location.path());
			if(vm.Show){
				//is user logged in?
				var elementExists = document.getElementById("signInBtn");
				//array of non-requestable delivery categories
				var conditions = ["Alma-E", "Remote Search Resource", "Alma-D", "Online Resource"];
				
				//need to determine whether we are in overlay mode. If we are, the path to the subLocation will be different - $ctrl.isFullViewOverlayOpen
				//also, consider items with multiple holdings parentCtrl.delivery.holding[]
				//path to result varies slightly according to whether we are in overlay mode, this can be retrieved by parentCtrl.isOverlayFullView(true/undefined)
				vm.displayMode = vm.parentCtrl.isOverlayFullView;
				
				//is the delivery category in the list defined as non-requestable?
				var delcat = conditions.some(function (el) {
					return vm.parentCtrl.result.delivery.deliveryCategory.includes(el);
				});
		
				//YML changes - remove 44YORK_YML_LIB from array of non-requestable libraries
				//perform additional lication-check for these - link should appear for YM and H locations - use subLocationCode

				if (!delcat){
					//array of non-requestable library codes
					var libCodes = ["44YORK_RBL_LIB", "44YORK_EXST_LIB","44YORK_EXST-B_LIB","44YORK_BIA_LIB","44YORK_NRM_LIB","44YORK_PET_LIB","44YORK_SOF_LIB","44YORK_ACA_LIB"]		
									
									
					var itemLib = vm.parentCtrl.result.delivery.bestlocation.libraryCode;

					//is our current sub location in the non-requestable list?
					var rqst = libCodes.indexOf(itemLib);
					
					if (itemLib == '44YORK_YML_LIB'){
						var subLocCode = vm.parentCtrl.result.delivery.bestlocation.subLocationCode;
						if (subLocCode == 'YM'){
							console.log ('*************requestable Minster***************');
							rqst = '-1';
						}else if (subLocCode == 'H'){
							console.log ('*************requestable Minster***************');
							rqst = '-1';
						}else{
							//non-requestable minster locations
							console.log ('*************non-requestable Minster***************');
							rqst = '1';
						}
					}
					
				};
				
				if (!elementExists) {	
					if (!delcat){
						//user logged in
						vm.buttonText = 'Use Book Takeaway for campus delivery (self isolating), postal loan or scan';
											
						//gather information for google form
						
						if (vm.displayMode){ //overlay
											
							var rec_id = vm.parentCtrl.result.pnx.control.sourcerecordid[0];
																	
							var title = encodeURIComponent(vm.parentCtrl.result.pnx.display.title[0]);
							//entry.1752528148=Title

							var author = encodeURIComponent(vm.parentCtrl.result.pnx.display.creator);
							//&entry.1866861278=Author

							var material_type = encodeURIComponent(vm.parentCtrl.result.pnx.addata.format);
							//&entry.1859840384=Material+type

							if (vm.parentCtrl.result.pnx.addata.hasOwnProperty('risdate')){
								var pub_year = encodeURIComponent(vm.parentCtrl.result.pnx.addata.risdate[0]);
							}

							var loc = encodeURIComponent(vm.parentCtrl.result.delivery.bestlocation.mainLocation) + ' ' + encodeURIComponent(vm.parentCtrl.result.delivery.bestlocation.subLocation);

							var shelfmark = vm.parentCtrl.result.delivery.bestlocation.callNumber;
							//&entry.1777930827=Shelfmark
							shelfmark = encodeURIComponent(shelfmark.replace('&nbsp;&nbsp;', ''));
						}else{
						//not in overlay	
														
							var rec_id = vm.parentCtrl.result.pnx.control.sourcerecordid[0];
							
											
							var title = encodeURIComponent(vm.parentCtrl.result.pnx.display.title[0]);
							//entry.1752528148=Title

							var author = encodeURIComponent(vm.parentCtrl.result.pnx.display.creator);
							//&entry.1866861278=Author

							var material_type = encodeURIComponent(vm.parentCtrl.result.pnx.addata.format);
							//&entry.1859840384=Material+type

							//journal records might not have this field
							
							if (vm.parentCtrl.result.pnx.addata.hasOwnProperty('risdate')){
								var pub_year = encodeURIComponent(vm.parentCtrl.result.pnx.addata.risdate[0]);
							}
							
							var loc = encodeURIComponent(vm.parentCtrl.result.delivery.bestlocation.mainLocation) + ' ' + encodeURIComponent(vm.parentCtrl.result.delivery.bestlocation.subLocation);

							var shelfmark = vm.parentCtrl.result.delivery.bestlocation.callNumber;
							//&entry.1777930827=Shelfmark
							shelfmark = encodeURIComponent(shelfmark.replace('&nbsp;&nbsp;', ''));
							
						}

						var userID = $scope.userID;
				
						var formURL = '';

						vm.serviceText = 'Use Book Takeaway for campus delivery (self isolating), postal loan or scan';
						
						//link to Google form with parameters retrieved above
						vm.formURL ='https://docs.google.com/forms/d/e/1FAIpQLScm2fmPXpqeFDf2wUMZNkTLakZ_nI6sJWwstHSS7l3fu_inLw/viewform?entry.34625858=&entry.1752528148=' + title + '&entry.301156700=' + 
						'&entry.97733718=' + author + '&entry.165289220=' + pub_year + '&entry.1078294971=&entry.2086517750=' + material_type + '&entry.1347329161=' + loc + '&entry.2093632974=' + shelfmark +  '&entry.435363005=' + userID + '&entry.1924359520=' + rec_id;
					
					} else {
						vm.buttonText = 'PLEASE LOG IN TO REQUEST';
						vm.formURL = '';
						vm.serviceText = '';
					}
					
				//determine whether book takeaway link should appear based on delcategory/library code
				vm.ShowReqLink = Boolean(delcat == false);
				vm.Requestable = Boolean(rqst == '-1');
			}
		}});
		
		
		console.log('************************End Book Takeaway*************************');
		/*******************end remove block ********************/
		
		

		/*change default no results page*/

		app.controller('prmNoSearchResultAfterController', [function () {
			var vm = this;
			vm.getSearchTerm = getSearchTerm;
			vm.pciSetting = vm.parentCtrl.searchStateService.searchObject.pcAvailability || '';
			function getSearchTerm() {
				return vm.parentCtrl.term;
			}
		}]);

		app.component('prmNoSearchResultAfter', {
			bindings: { parentCtrl: '<' },
			controller: 'prmNoSearchResultAfterController',
			template: '<md-card class="default-card zero-margin _md md-primoExplore-theme"><md-card-title><md-card-title-text><span translate="" class="md-headline ng-scope">No results found</span></md-card-title-text></md-card-title><md-card-content><p><span>There are no results matching your search:<blockquote><i>{{$ctrl.getSearchTerm()}}</i>.</blockquote><div ng-if=$ctrl.pciSetting !== \'true\'"><a href="https://yorsearch.york.ac.uk/primo-explore/search?query=any,contains,{{$ctrl.getSearchTerm()}}&tab=default_tab&search_scope=CS_EVERYTHING&vid=44YORK-NUI&offset=0&sortby=rank&pcAvailability=true"><b>Widen your search to search everything</b></a></div></span></p><p><span translate="" class="bold-text ng-scope">Suggestions:</span></p><ul><li translate="" class="ng-scope">Make sure that all words are spelled correctly.</li><li translate="" class="ng-scope">Try a different search scope.</li><li translate="" class="ng-scope">Try different search terms.</li><li translate="" class="ng-scope">Try more general search terms.</li><li translate="" class="ng-scope">Try fewer search terms.</li></ul></p><p><b><a href="http://subjectguides.york.ac.uk/">Your Academic Liaison Librarian can offer you subject specific help and support</a></b></p></md-card-content></md-card>'
		});

		/*end no results customisation */

		/*Custom Footer*/
		/*- ### --- Primo Footer JS ---- Code Originally from NLNZ --- ### */
		app.component('prmExploreFooterAfter', {
			bindings: { parentCtrl: '<' },
			template: '<div id="footerWrapper"><ul><li><div class="ftext"><span class="headline">University Library</span><p>&nbsp;</p><p>University of York, Heslington, York, YO10 5DD, UK</p><p>Tel: +44 (0)1904 323838</p><p>&nbsp;</p></div></li><li><div class="ftext"><span class="headline">Library Links</span><p>&nbsp;</p><p><a href="mailto:lib-enquiry@york.ac.uk" class="footer_link">Contact Us</a><p><a href="https://informationbookings.york.ac.uk/calendar/study-spaces/">Book a Study Room</a></p></div></li></ul><div class="line-2-copy-left"></div><div class="line-2-copy-right"></div><div class="bar"><div class="bar-wrap"><ul class="links"><li><a href="https://www.york.ac.uk/library" class="md-primoExplore-theme">Library Homepage</a>&nbsp;&nbsp;&nbsp;| </li><li><a href="https://www.york.ac.uk/about/legal-statements/" class="md-primoExplore-theme">Legal Statements</a>&nbsp;&nbsp;&nbsp;| </li><li><a href="https://www.york.ac.uk/about/legal-statements/#tab-5" class="md-primoExplore-theme">Privacy</a></li></ul><div class="logos"><span></span></a><a href="https://www.york.ac.uk/" target="_blank" class="all-govt md-primoExplore-theme"><span><img title="" src="custom/44YORK-NUI/img/uoy-logo.png" width="210" alt="University of York logo"></span></a></div><div class="clear"></div><div class="copyright"></div></div></div></div>'

		});

		angular.module('changeExample', []).controller('ExampleController', ['$scope', function ($scope) {
			$scope.counter = 0;
			$scope.change = function () {
				$scope.counter++;
			};
		}]);

		//The lines below solved the issue
		webPreferences: {
			nodeIntegration: true;
		}

		/*----------libchat slider-----------*/
		(function () {
			var lc = document.createElement('script');lc.type = 'text/javascript';lc.async = 'true';
			lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'region-eu.libanswers.com/load_chat.php?hash=cf1799572b0b3157a8ee72471190c327';
			var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(lc, s);
		})();
		/*---------------libchat slider ends ---------------*/

		console.log("::FINISHED LOADING 44YORK CUSTOM::");

		/*generate list of required modules*/
		console.log(angular.module('viewCustom').requires);

		angular.module('reportProblem', []);

		var getUrlParameter = function getUrlParameter(sParam) {
			var sPageURL = window.location.search.substring(1),
			    sURLVariables = sPageURL.split('&'),
			    sParameterName,
			    i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
				}
			}
		};

		var docid = getUrlParameter('docid');
		var rep_url = "https://docs.google.com/forms/d/e/1FAIpQLSdWTLtHSWjgIijK0ZQU0Rub5L_Mx9etXmvesW_hoSHCSfr3Dw/viewform?usp=pp_url&entry.982245342=";

		angular.module('reportProblem').component('ocaReportProblem', {
			bindings: {
				messageText: '@',
				buttonText: '@',
				reportUrl: '@'
			},
			template: '\n      <div ng-if="$ctrl.show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\n          <span class="margin-right-small">{{$ctrl.messageText}}</span>\n          <a ng-href="{{$ctrl.targetUrl}}" target="_blank">\n              <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\n                  <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_report_problem_24px"></prm-icon>\n                  <span style="text-transform: none;">{{$ctrl.buttonText}}</span>\n              </button>\n          </a>\n      </div>',
			controller: ['$location', '$httpParamSerializer', function ($location, $httpParamSerializer) {
				this.messageText = this.messageText || 'See something that doesn\'t look right?';
				this.buttonText = this.buttonText || 'Report a Problem';
				this.showLocations = ['/fulldisplay', '/openurl'];
				this.$onInit = function () {
					//this.targetUrl = this.reportUrl + $httpParamSerializer($location.search());
					//this.targetUrl = rep_url;
					this.targetUrl = rep_url + getUrlParameter('docid');
					this.show = this.showLocations.includes($location.path());
				};
			}]
		});

		app.component('prmActionListAfter', { template: '<oca-report-problem report-url="' + rep_url + '" message-text="Want to report a problem?" button-text="Get in touch" />' });

		/* end report problem */


		angular.module('googleAnalytics', []);
		angular.module('googleAnalytics').run(function ($rootScope, $interval, analyticsOptions) {
			if (analyticsOptions.hasOwnProperty("enabled") && analyticsOptions.enabled) {
				if (analyticsOptions.hasOwnProperty("siteId") && analyticsOptions.siteId != '') {
					if (typeof ga === 'undefined') {
						(function (i, s, o, g, r, a, m) {
							i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
								(i[r].q = i[r].q || []).push(arguments);
							}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
						})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

						ga('create', analyticsOptions.siteId, { 'alwaysSendReferrer': true });
						ga('set', 'anonymizeIp', true);
					}
				}
				$rootScope.$on('$locationChangeSuccess', function (event, toState, fromState) {
					if (analyticsOptions.hasOwnProperty("defaultTitle")) {
						var documentTitle = analyticsOptions.defaultTitle;
						var interval = $interval(function () {
							if (document.title !== '') documentTitle = document.title;
							if (window.location.pathname.indexOf('openurl') !== -1 || window.location.pathname.indexOf('fulldisplay') !== -1) if (angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).length === 0) return;else documentTitle = angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).text();

							if (typeof ga !== 'undefined') {
								if (fromState != toState) ga('set', 'referrer', fromState);
								ga('set', 'location', toState);
								ga('set', 'title', documentTitle);
								ga('send', 'pageview');
							}
							$interval.cancel(interval);
						}, 0);
					}
				});
			}
		});
		angular.module('googleAnalytics').value('analyticsOptions', {
			enabled: true,
			siteId: 'UA-21938253-13',
			defaultTitle: 'YorSearch'
		});
	})();

	/*- ########## ---------- Non AngularJS code ---------- ########## */
	/*- ########## ----------Footer, code courtesy of EL/NLNZ - measure page once "is sticky" is put in and (try) to put footer after results ---------- ########## */

	// Instantiate variables that will be reset repeatedly in the listener function
	var max = 0;
	var winHeight = 0;
	var scrollTop = 0;
	var foot = 0;
	// and let's have a small buffer before the footerWrapper
	var buffer = 50;

	window.addEventListener('scroll', function (e) {
		// Total length of document
		max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
		// Height of window
		winHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
		// Point of the top of the document visible on screen
		scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
		// Height of footer
		foot = Math.round(parseFloat(window.getComputedStyle(document.getElementById('footerWrapper')).height));
		// check where we are in terms of scrolling and the footer
		if (scrollTop + winHeight >= max - foot) {
			document.querySelectorAll('.primo-scrollbar, .is-stuck')[0].style.maxHeight = 'calc(100% - ' + Math.abs(max - winHeight - scrollTop - foot - buffer) + 'px)';
		} else {
			document.querySelectorAll('.primo-scrollbar, .is-stuck')[0].style.maxHeight = 'calc(100% - 2em)';
		}
	});;