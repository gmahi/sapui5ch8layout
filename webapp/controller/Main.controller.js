sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/Filter"
], function(Controller, Device, Filter) {
	"use strict";

	return Controller.extend("ch81fullscreen.controller.Main", {

		onInit: function() {
			var sContentDensityClass = "";
			if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
				sContentDensityClass = "";
			} else if (!Device.support.touch) {
				sContentDensityClass = "sapUiSizeCompact";
			} else {
				sContentDensityClass = "sapUiSizeCozy";
			}
			this.getView().addStyleClass(sContentDensityClass);
		},
		onTableUpdateFinished: function(evt) {
			var sTitle = "Sales Orders",
				oTable = this.getView().byId("table");
			//catch cases where the backend is not supporting remote count
			if (oTable.getBinding("items").isLengthFinal()) {
				var iCount = evt.getParameter("total"),
					iItems = oTable.getItems().length;
				sTitle += "(" + iItems + "/" + iCount + ")";

			}

			this.getView().byId("title").setText(sTitle);
		},
		onChange: function(oEvent) {
			var sSearchValue = oEvent.getSource().getValue(),
				aFilters = [];
			if (sSearchValue.length > 0) {
				var oFilterName = new Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sSearchValue);
				var oFilterID = new Filter("SalesOrderID", sap.ui.model.FilterOperator.Contains, sSearchValue);
				aFilters.push(new Filter({
					filters: [oFilterName, oFilterID],
					And: false
				}));

			}
			this.getView().byId("table").getBinding("items").filter(aFilters, "Application");

		},

		onItemPress: function(oEvent) {
			var sSalesOrderId = oEvent.getSource().getBindingContext().getProperty("SalesOrderID");
			this.getOwnerComponent().getRouter().navTo("salesOrder", {
				SalesOrderID: sSalesOrderId
			}, false);
		}

	});
});