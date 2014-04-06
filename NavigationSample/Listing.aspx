<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Listing.aspx.cs" Inherits="Navigation.Sample.Listing" %>
<%@ Register assembly="Navigation" namespace="Navigation" tagprefix="cc1" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title></title>
</head>
<body>
	<form id="form1" runat="server">
	<div>
	<asp:ScriptManager ID="ScriptManager1" runat="server" EnableHistory="true" EnableSecureHistoryState="false">
		<Scripts>
			<asp:ScriptReference Name="Navigation.HTML5History.js" Assembly="Navigation" />
		</Scripts>
	</asp:ScriptManager>
	<asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional" ChildrenAsTriggers="false">
		<ContentTemplate>
			<cc1:ViewSwitcher runat="server" DesktopSwitchText="Deskop view" MobileSwitchText="Mobile view"/>
			<asp:FormView ID="FormView1" runat="server" DataSourceID="NavigationDataSource1" DefaultMode="Edit">
				<EditItemTemplate>
					<asp:Label ID="Label1" runat="server" Text="Name" AssociatedControlID="TextBox1" />
					<asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("[name]") %>' />
					<asp:Label ID="Label2" runat="server" Text="Min Date of Birth" AssociatedControlID="TextBox2" />
					<asp:TextBox ID="TextBox2" runat="server" Text='<%# Bind("[minDateOfBirth]") %>' />
					<asp:Button ID="Button1" runat="server" Text="Search" CommandName="Update" />
					<asp:CompareValidator ID="CompareValidator1" runat="server" ControlToValidate="TextBox2" EnableClientScript="false" ErrorMessage="date error" Operator="DataTypeCheck" Type="Date" />
				</EditItemTemplate>
			</asp:FormView>
			<cc1:NavigationDataSource ID="NavigationDataSource1" runat="server">
				<SelectParameters>
					<cc1:NavigationDataParameter Name="name"/> 
					<cc1:NavigationDataParameter Name="minDateOfBirth"/> 
				</SelectParameters>
				<UpdateParameters>
					<cc1:NavigationDataParameter Name="sortExpression" Reset="true"/>
					<cc1:NavigationDataParameter Name="startRowIndex" Reset="true"/>
				</UpdateParameters>
			</cc1:NavigationDataSource>
			Page size 
			<asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="{RefreshPostBack &startRowIndex,maximumRows=5}" Text="5" />
			<asp:HyperLink ID="HyperLink2" runat="server" NavigateUrl="{RefreshPostBack &startRowIndex,maximumRows}" Text="10" />
			<asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false" ItemType="Navigation.Sample.Person" SelectMethod="Search" OnCallingDataMethods="GridView1_CallingDataMethods">
				<Columns>
					<asp:TemplateField HeaderText="Name">
						<HeaderTemplate><cc1:Sorter ID="Sorter1" runat="server" Text="Name" SortBy="Name" Navigate="true" PostBackHyperLink="true" /></HeaderTemplate>
						<ItemTemplate>
							<cc1:NavigationHyperLink ID="NavigationHyperLink1" runat="server" Action="Select" ToData='<%# new NavigationData(){{ "id" , Item.Id }} %>' Text='<%#: Item.Name %>' />
						</ItemTemplate>
					</asp:TemplateField>
					<asp:BoundField DataField="DateOfBirth" DataFormatString="{0:d}" HeaderText="Date of Birth" />
				</Columns>
			</asp:GridView>
			<cc1:Pager ID="Pager1" runat="server" QueryStringField="q" PostBackHyperLink="true">
				<Fields>
					<asp:NextPreviousPagerField ShowFirstPageButton="true" ShowLastPageButton="true" />
				</Fields>
			</cc1:Pager>
			<asp:Literal ID="Literal1" runat="server" Text="{NavigationData totalRowCount,Total Count {0}}" />
			<cc1:HistoryNavigator runat="server" />
		</ContentTemplate>
		<Triggers>
			<cc1:NavigationDataTrigger Key="name" />
			<cc1:NavigationDataTrigger Key="minDateOfBirth" />
			<cc1:NavigationDataTrigger Key="sortExpression" />
			<cc1:NavigationDataTrigger Key="startRowIndex" />
			<cc1:NavigationDataTrigger Key="maximumRows" />
		</Triggers>
	</asp:UpdatePanel>
	</div>
	</form>
</body>
</html>
