<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Details.aspx.cs" Inherits="Navigation.Sample.Details" %>
<%@ Register assembly="Navigation" namespace="Navigation" tagprefix="cc1" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
	<asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="{NavigationBackLink 1}" Text="Person Search" />
	<asp:FormView ID="FormView1" runat="server" ItemType="Navigation.Sample.Person"  SelectMethod="GetDetails" OnCallingDataMethods="FormView1_CallingDataMethods">
		<ItemTemplate>
			Name:
			<asp:Label ID="NameLabel" runat="server" Text='<%#: Item.Name %>' /><br />
			Date of Birth:
			<asp:Label ID="DateOfBirthLabel" runat="server" Text='<%# Item.DateOfBirth.ToString("d") %>' />
		</ItemTemplate>
	</asp:FormView>
    </div>
    </form>
</body>
</html>