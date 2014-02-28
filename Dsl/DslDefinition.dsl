<?xml version="1.0" encoding="utf-8"?>
<Dsl xmlns:dm0="http://schemas.microsoft.com/VisualStudio/2008/DslTools/Core" dslVersion="1.0.0.0" Id="ff6e704d-d5f4-4cba-b3b2-b2793d99fa40" Description="A designer for creating StateInfo configuration for use within the Navigation for ASP.NET Web Forms framework." Name="NavigationLanguage" DisplayName="Navigation Designer" Namespace="Navigation.Designer" ProductName="Navigation Diagram" CompanyName="Navigation" PackageGuid="c37cb6a6-6192-4282-a9c6-37f88ffdf037" PackageNamespace="Navigation.Designer" xmlns="http://schemas.microsoft.com/VisualStudio/2005/DslTools/DslDefinitionModel">
  <Classes>
    <DomainClass Id="6e837751-5520-4926-8fde-c8067343fc5e" Description="The root in which all other elements are embedded. Appears as a diagram." Name="NavigationDiagram" DisplayName="Navigation Diagram" Namespace="Navigation.Designer">
      <ElementMergeDirectives>
        <ElementMergeDirective>
          <Notes>Creates an embedding link when an element is dropped onto a model. </Notes>
          <Index>
            <DomainClassMoniker Name="State" />
          </Index>
          <LinkCreationPaths>
            <DomainPath>NavigationDiagramHasStates.States</DomainPath>
          </LinkCreationPaths>
        </ElementMergeDirective>
      </ElementMergeDirectives>
    </DomainClass>
    <DomainClass Id="d1f7dd3e-1a13-408e-8eb3-c098629efaa6" Description="States embedded in the Diagram. Appear as boxes on the diagram." Name="State" DisplayName="State" Namespace="Navigation.Designer">
      <Properties>
        <DomainProperty Id="b1047807-174f-439c-92ea-7e6939ca0d2f" Description="Unique within a Dialog, used by Dialog and Transition elements to specify configuration." Name="Key" DisplayName="Key" Category="Definition" IsElementName="true">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="bc51c31b-e9b1-4068-9d87-2b2f7770fc74" Description="The aspx Page to display when navigating to this State." Name="Page" DisplayName="Page" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="45e4f540-55ab-43a7-b040-c4d2d2be03f8" Description="The textual description of the State. ResourceType and ResourceKey can be used for localization." Name="Title" DisplayName="Title" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="da673d43-18df-4880-9630-d40a256d4e18" Description="The route Url pattern." Name="Route" DisplayName="Route" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="548068fa-1d42-479f-8ce0-595b0a116dd1" Description="Indicates whether to maintain crumb trail information." Name="TrackCrumbTrail" DisplayName="Track Crumb Trail" DefaultValue="true" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Boolean" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="8cbc9cde-4726-4217-b3e5-58268a6e7749" Description="Indicates whether ASP.NET should validate that the user has authority to access the physical Page." Name="CheckPhysicalUrlAccess" DisplayName="Check Physical Url Access" DefaultValue="true" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Boolean" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="cd8585c1-97a7-42c1-83f8-b266a63b43e6" Description="The master pages to assign to the Page when displayed." Name="Masters" DisplayName="Masters" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="a5512814-95e3-45e7-8589-2bdb19c8fc62" Description="The theme to assign to the Page when displayed." Name="Theme" DisplayName="Theme" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="f4231a6d-3ad7-493e-851c-86ddc9cebed1" Description="Used with ResourceKey, specifies the resource file type for State Title localization." Name="ResourceType" DisplayName="Resource Type" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="5797b021-2423-419c-af55-e36433851760" Description="Used with ResourceType, specifies the resource name for State Title localization." Name="ResourceKey" DisplayName="Resource Key" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="de7421ff-b4b2-435f-8b0f-85fbac556e2e" Description="The order of the State in the configuration." Name="Order" DisplayName="Order" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Int32" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="d9753c6c-ebd7-4869-b761-3ceeb3e83b7f" Description="Set to true to indicate the start of a Dialog." Name="Initial" DisplayName="Initial" DefaultValue="false" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Boolean" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="116601b0-5dc3-4d3b-8007-5bc939021622" Description="The Url that will cause a navigation to this Initial State. It should not contain a query string." Name="Path" DisplayName="Path" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="8c37b5f8-5d24-4776-8170-398e19fd75f3" Description="Unique across Dialogs and passed as the action parameter to the StateController when navigating." Name="DialogKey" DisplayName="Dialog Key" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="f2dd42a1-03c5-4d4a-bdad-391431696d67" Description="The textual description of the Dialog. ResourceType and ResourceKey can be used for localization." Name="DialogTitle" DisplayName="Dialog Title" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="82321504-5ffc-4ee6-ba32-04c4f5e27568" Description="Used with ResourceType, specifies the resource name for Dialog Title localization." Name="DialogResourceType" DisplayName="Dialog Resource Type" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="32d13a53-1f72-42dd-8d25-023dd12aed35" Description="Used with ResourceKey, specifies the resource file type for Dialog Title localization." Name="DialogResourceKey" DisplayName="Dialog Resource Key" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="5960082d-80c6-4eb9-974e-94f68b549b4f" Description="The order of the Dialog in the configuration." Name="DialogOrder" DisplayName="Dialog Order" Category="Dialog">
          <Type>
            <ExternalTypeMoniker Name="/System/Int32" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="c6ae86e2-ba7c-4462-9c82-6ad626cebb7c" Description="The aspx page to display for a mobile device navigating to this State." Name="MobilePage" DisplayName="Mobile Page" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="bba97d48-f1a6-4b8c-b754-b92506084d1f" Description="The mobile device route Url pattern." Name="MobileRoute" DisplayName="Mobile Route" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="ae7d5fa8-196e-4e09-ac1a-08260c24d74a" Description="The theme to assign to the Page when displayed for a mobile device." Name="MobileTheme" DisplayName="Mobile Theme" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="cad0a9a7-eb8d-4078-a0d7-fd1a89a3a64c" Description="The master pages to assign to the Page when displayed for a mobile device." Name="MobileMasters" DisplayName="Mobile Masters" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="e0c21f3b-9895-4a3e-836e-7b42d3daa0f5" Description="The default NavigationData for this State." Name="Defaults" DisplayName="Defaults" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="e328f1c5-4344-4f4f-be2f-23f328169164" Description="The default types of NavigationData for this State." Name="DefaultTypes" DisplayName="Default Types" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="1e7e5ad7-50e2-45da-a2af-7d932adcd8e0" Description="The derived NavigationData for this State." Name="Derived" DisplayName="Derived" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
      </Properties>
    </DomainClass>
  </Classes>
  <Relationships>
    <DomainRelationship Id="7d3034e5-5e93-4742-a69a-7b69dfadcf06" Description="Embedding relationship between the Diagram and States" Name="NavigationDiagramHasStates" DisplayName="Navigation Diagram Has States" Namespace="Navigation.Designer" IsEmbedding="true">
      <Source>
        <DomainRole Id="d2de027a-393f-4a8d-a70c-3347f4d6962b" Description="" Name="NavigationDiagram" DisplayName="Navigation Diagram" PropertyName="States" PropagatesCopy="PropagatesCopyToLinkAndOppositeRolePlayer" PropertyDisplayName="States">
          <RolePlayer>
            <DomainClassMoniker Name="NavigationDiagram" />
          </RolePlayer>
        </DomainRole>
      </Source>
      <Target>
        <DomainRole Id="1b72109c-ef14-43b2-9f57-3e640dc5b7df" Description="" Name="Element" DisplayName="Element" PropertyName="NavigationDiagram" Multiplicity="One" PropagatesDelete="true" PropertyDisplayName="Navigation Diagram">
          <RolePlayer>
            <DomainClassMoniker Name="State" />
          </RolePlayer>
        </DomainRole>
      </Target>
    </DomainRelationship>
    <DomainRelationship Id="11077fd6-174f-42cd-b602-dd168e0c4919" Description="Navigation between States." Name="Transition" DisplayName="Transition" Namespace="Navigation.Designer">
      <Properties>
        <DomainProperty Id="7ed259d7-c1ba-4832-ad76-2ec9d40a7407" Description="Unique within a State and passed as the action parameter to the StateController when navigating." Name="Key" DisplayName="Key" Category="Definition" IsElementName="true">
          <Type>
            <ExternalTypeMoniker Name="/System/String" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="bddda6ac-4739-4ff5-ac13-0c7120873adb" Description="Set to true to ensure the linked States always have the same parent Dialog." Name="CanNavigateBack" DisplayName="Can Navigate Back" DefaultValue="true" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Boolean" />
          </Type>
        </DomainProperty>
        <DomainProperty Id="184f9d4d-a4b3-486e-920b-bab16dfb47c9" Description="The order of the Transition in the configuration." Name="Order" DisplayName="Order" Category="Definition">
          <Type>
            <ExternalTypeMoniker Name="/System/Int32" />
          </Type>
        </DomainProperty>
      </Properties>
      <Source>
        <DomainRole Id="a630ba51-a1b9-4bda-bc57-f14b8cc33a80" Description="Description for Navigation.Designer.ExampleRelationship.Target" Name="Predecessor" DisplayName="Predecessor" PropertyName="Successors" PropertyDisplayName="Successors">
          <RolePlayer>
            <DomainClassMoniker Name="State" />
          </RolePlayer>
        </DomainRole>
      </Source>
      <Target>
        <DomainRole Id="adbf7b8f-7947-438e-ba60-1d0dcfa4cb58" Description="Description for Navigation.Designer.ExampleRelationship.Source" Name="Successor" DisplayName="Successor" PropertyName="Predecessors" PropertyDisplayName="Predecessors">
          <RolePlayer>
            <DomainClassMoniker Name="State" />
          </RolePlayer>
        </DomainRole>
      </Target>
    </DomainRelationship>
  </Relationships>
  <Types>
    <ExternalType Name="DateTime" Namespace="System" />
    <ExternalType Name="String" Namespace="System" />
    <ExternalType Name="Int16" Namespace="System" />
    <ExternalType Name="Int32" Namespace="System" />
    <ExternalType Name="Int64" Namespace="System" />
    <ExternalType Name="UInt16" Namespace="System" />
    <ExternalType Name="UInt32" Namespace="System" />
    <ExternalType Name="UInt64" Namespace="System" />
    <ExternalType Name="SByte" Namespace="System" />
    <ExternalType Name="Byte" Namespace="System" />
    <ExternalType Name="Double" Namespace="System" />
    <ExternalType Name="Single" Namespace="System" />
    <ExternalType Name="Guid" Namespace="System" />
    <ExternalType Name="Boolean" Namespace="System" />
    <ExternalType Name="Char" Namespace="System" />
  </Types>
  <Shapes>
    <GeometryShape Id="9f74225c-a664-4930-a0fe-46845216068a" Description="Shape used to represent ExampleElements on a Diagram." Name="StateShape" DisplayName="State Shape" Namespace="Navigation.Designer" FixedTooltipText="State Shape" FillColor="242, 239, 229" OutlineColor="113, 111, 110" InitialWidth="2" InitialHeight="0.75" OutlineThickness="0.01" Geometry="Rectangle">
      <Notes>The shape has a text decorator used to display the Name property of the mapped ExampleElement.</Notes>
      <ShapeHasDecorators Position="InnerTopCenter" HorizontalOffset="0" VerticalOffset="0">
        <TextDecorator Name="KeyDecorator" DisplayName="Key Decorator" DefaultText="KeyDecorator" />
      </ShapeHasDecorators>
      <ShapeHasDecorators Position="Center" HorizontalOffset="0" VerticalOffset="0">
        <TextDecorator Name="PageDecorator" DisplayName="Page Decorator" DefaultText="PageDecorator" />
      </ShapeHasDecorators>
      <ShapeHasDecorators Position="InnerTopLeft" HorizontalOffset="0" VerticalOffset="0">
        <IconDecorator Name="InitialDecorator" DisplayName="Initial Decorator" DefaultIcon="Resources\Start.emf" />
      </ShapeHasDecorators>
    </GeometryShape>
  </Shapes>
  <Connectors>
    <Connector Id="70e435e1-9682-4eef-b15c-13f1f8c8a803" Description="Connector between the ExampleShapes. Represents ExampleRelationships on the Diagram." Name="TransitionConnector" DisplayName="Transition Connector" Namespace="Navigation.Designer" FixedTooltipText="Transition Connector" Color="113, 111, 110" TargetEndStyle="EmptyArrow" Thickness="0.01">
      <ConnectorHasDecorators Position="TargetTop" OffsetFromShape="0" OffsetFromLine="0">
        <TextDecorator Name="KeyDecorator" DisplayName="Key Decorator" DefaultText="KeyDecorator" />
      </ConnectorHasDecorators>
      <ConnectorHasDecorators Position="SourceBottom" OffsetFromShape="0" OffsetFromLine="0">
        <IconDecorator Name="CanGoBackDecorator" DisplayName="Can Go Back Decorator" DefaultIcon="Resources\Back.bmp" />
      </ConnectorHasDecorators>
    </Connector>
  </Connectors>
  <XmlSerializationBehavior Name="NavigationLanguageSerializationBehavior" Namespace="Navigation.Designer">
    <ClassData>
      <XmlClassData TypeName="NavigationDiagram" MonikerAttributeName="" SerializeId="true" MonikerElementName="navigationDiagramMoniker" ElementName="navigationDiagram" MonikerTypeName="NavigationDiagramMoniker">
        <DomainClassMoniker Name="NavigationDiagram" />
        <ElementData>
          <XmlRelationshipData RoleElementName="states">
            <DomainRelationshipMoniker Name="NavigationDiagramHasStates" />
          </XmlRelationshipData>
        </ElementData>
      </XmlClassData>
      <XmlClassData TypeName="State" MonikerAttributeName="" SerializeId="true" MonikerElementName="stateMoniker" ElementName="state" MonikerTypeName="StateMoniker">
        <DomainClassMoniker Name="State" />
        <ElementData>
          <XmlRelationshipData UseFullForm="true" RoleElementName="successors">
            <DomainRelationshipMoniker Name="Transition" />
          </XmlRelationshipData>
          <XmlPropertyData XmlName="key">
            <DomainPropertyMoniker Name="State/Key" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="page">
            <DomainPropertyMoniker Name="State/Page" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="title">
            <DomainPropertyMoniker Name="State/Title" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="route">
            <DomainPropertyMoniker Name="State/Route" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="trackCrumbTrail">
            <DomainPropertyMoniker Name="State/TrackCrumbTrail" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="checkPhysicalUrlAccess">
            <DomainPropertyMoniker Name="State/CheckPhysicalUrlAccess" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="masters">
            <DomainPropertyMoniker Name="State/Masters" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="theme">
            <DomainPropertyMoniker Name="State/Theme" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="resourceType">
            <DomainPropertyMoniker Name="State/ResourceType" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="resourceKey">
            <DomainPropertyMoniker Name="State/ResourceKey" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="order">
            <DomainPropertyMoniker Name="State/Order" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="initial">
            <DomainPropertyMoniker Name="State/Initial" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="path">
            <DomainPropertyMoniker Name="State/Path" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="dialogKey">
            <DomainPropertyMoniker Name="State/DialogKey" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="dialogTitle">
            <DomainPropertyMoniker Name="State/DialogTitle" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="dialogResourceType">
            <DomainPropertyMoniker Name="State/DialogResourceType" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="dialogResourceKey">
            <DomainPropertyMoniker Name="State/DialogResourceKey" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="dialogOrder">
            <DomainPropertyMoniker Name="State/DialogOrder" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="mobilePage">
            <DomainPropertyMoniker Name="State/MobilePage" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="mobileRoute">
            <DomainPropertyMoniker Name="State/MobileRoute" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="mobileTheme">
            <DomainPropertyMoniker Name="State/MobileTheme" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="mobileMasters">
            <DomainPropertyMoniker Name="State/MobileMasters" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="defaults">
            <DomainPropertyMoniker Name="State/Defaults" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="defaultTypes">
            <DomainPropertyMoniker Name="State/DefaultTypes" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="derived">
            <DomainPropertyMoniker Name="State/Derived" />
          </XmlPropertyData>
        </ElementData>
      </XmlClassData>
      <XmlClassData TypeName="NavigationDiagramHasStates" MonikerAttributeName="" SerializeId="true" MonikerElementName="navigationDiagramHasStatesMoniker" ElementName="navigationDiagramHasStates" MonikerTypeName="NavigationDiagramHasStatesMoniker">
        <DomainRelationshipMoniker Name="NavigationDiagramHasStates" />
      </XmlClassData>
      <XmlClassData TypeName="Transition" MonikerAttributeName="" SerializeId="true" MonikerElementName="transitionMoniker" ElementName="transition" MonikerTypeName="TransitionMoniker">
        <DomainRelationshipMoniker Name="Transition" />
        <ElementData>
          <XmlPropertyData XmlName="key">
            <DomainPropertyMoniker Name="Transition/Key" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="canNavigateBack">
            <DomainPropertyMoniker Name="Transition/CanNavigateBack" />
          </XmlPropertyData>
          <XmlPropertyData XmlName="order">
            <DomainPropertyMoniker Name="Transition/Order" />
          </XmlPropertyData>
        </ElementData>
      </XmlClassData>
      <XmlClassData TypeName="StateShape" MonikerAttributeName="" SerializeId="true" MonikerElementName="stateShapeMoniker" ElementName="stateShape" MonikerTypeName="StateShapeMoniker">
        <GeometryShapeMoniker Name="StateShape" />
      </XmlClassData>
      <XmlClassData TypeName="TransitionConnector" MonikerAttributeName="" SerializeId="true" MonikerElementName="transitionConnectorMoniker" ElementName="transitionConnector" MonikerTypeName="TransitionConnectorMoniker">
        <ConnectorMoniker Name="TransitionConnector" />
      </XmlClassData>
      <XmlClassData TypeName="NavigationLanguageDiagram" MonikerAttributeName="" SerializeId="true" MonikerElementName="navigationLanguageDiagramMoniker" ElementName="navigationLanguageDiagram" MonikerTypeName="NavigationLanguageDiagramMoniker">
        <DiagramMoniker Name="NavigationLanguageDiagram" />
      </XmlClassData>
    </ClassData>
  </XmlSerializationBehavior>
  <ExplorerBehavior Name="NavigationLanguageExplorer">
    <CustomNodeSettings>
      <ExplorerNodeSettings IconToDisplay="Resources\TaskTool.bmp">
        <Class>
          <DomainClassMoniker Name="State" />
        </Class>
      </ExplorerNodeSettings>
    </CustomNodeSettings>
  </ExplorerBehavior>
  <ConnectionBuilders>
    <ConnectionBuilder Name="TransitionBuilder">
      <Notes>Provides for the creation of an ExampleRelationship by pointing at two ExampleElements.</Notes>
      <LinkConnectDirective>
        <DomainRelationshipMoniker Name="Transition" />
        <SourceDirectives>
          <RolePlayerConnectDirective>
            <AcceptingClass>
              <DomainClassMoniker Name="State" />
            </AcceptingClass>
          </RolePlayerConnectDirective>
        </SourceDirectives>
        <TargetDirectives>
          <RolePlayerConnectDirective>
            <AcceptingClass>
              <DomainClassMoniker Name="State" />
            </AcceptingClass>
          </RolePlayerConnectDirective>
        </TargetDirectives>
      </LinkConnectDirective>
    </ConnectionBuilder>
  </ConnectionBuilders>
  <Diagram Id="f256f98a-2384-49e7-b00b-e4c118a08c3a" Description="Description for Navigation.Designer.NavigationLanguageDiagram" Name="NavigationLanguageDiagram" DisplayName="Minimal Language Diagram" Namespace="Navigation.Designer">
    <Class>
      <DomainClassMoniker Name="NavigationDiagram" />
    </Class>
    <ShapeMaps>
      <ShapeMap>
        <DomainClassMoniker Name="State" />
        <ParentElementPath>
          <DomainPath>NavigationDiagramHasStates.NavigationDiagram/!NavigationDiagram</DomainPath>
        </ParentElementPath>
        <DecoratorMap>
          <IconDecoratorMoniker Name="StateShape/InitialDecorator" />
          <VisibilityPropertyPath>
            <DomainPropertyMoniker Name="State/Initial" />
            <PropertyFilters>
              <PropertyFilter FilteringValue="True" />
            </PropertyFilters>
          </VisibilityPropertyPath>
        </DecoratorMap>
        <DecoratorMap>
          <TextDecoratorMoniker Name="StateShape/KeyDecorator" />
          <PropertyDisplayed>
            <PropertyPath>
              <DomainPropertyMoniker Name="State/Key" />
            </PropertyPath>
          </PropertyDisplayed>
        </DecoratorMap>
        <DecoratorMap>
          <TextDecoratorMoniker Name="StateShape/PageDecorator" />
          <PropertyDisplayed>
            <PropertyPath>
              <DomainPropertyMoniker Name="State/Page" />
            </PropertyPath>
          </PropertyDisplayed>
        </DecoratorMap>
        <GeometryShapeMoniker Name="StateShape" />
      </ShapeMap>
    </ShapeMaps>
    <ConnectorMaps>
      <ConnectorMap>
        <ConnectorMoniker Name="TransitionConnector" />
        <DomainRelationshipMoniker Name="Transition" />
        <DecoratorMap>
          <IconDecoratorMoniker Name="TransitionConnector/CanGoBackDecorator" />
          <VisibilityPropertyPath>
            <DomainPropertyMoniker Name="Transition/CanNavigateBack" />
            <PropertyFilters>
              <PropertyFilter FilteringValue="True" />
            </PropertyFilters>
          </VisibilityPropertyPath>
        </DecoratorMap>
        <DecoratorMap>
          <TextDecoratorMoniker Name="TransitionConnector/KeyDecorator" />
          <PropertyDisplayed>
            <PropertyPath>
              <DomainPropertyMoniker Name="Transition/Key" />
            </PropertyPath>
          </PropertyDisplayed>
        </DecoratorMap>
      </ConnectorMap>
    </ConnectorMaps>
  </Diagram>
  <Designer CopyPasteGeneration="CopyPasteOnly" FileExtension="nav" EditorGuid="f958d75c-6cc6-41c1-9601-eb0682633ea7">
    <RootClass>
      <DomainClassMoniker Name="NavigationDiagram" />
    </RootClass>
    <XmlSerializationDefinition CustomPostLoad="false">
      <XmlSerializationBehaviorMoniker Name="NavigationLanguageSerializationBehavior" />
    </XmlSerializationDefinition>
    <ToolboxTab TabText="Navigation Designer">
      <ElementTool Name="State" ToolboxIcon="Resources\TaskTool.bmp" Caption="State" Tooltip="Create a State" HelpKeyword="CreateExampleClassF1Keyword">
        <DomainClassMoniker Name="State" />
      </ElementTool>
      <ConnectionTool Name="Transition" ToolboxIcon="Resources\FlowTool.bmp" Caption="Transition" Tooltip="Drag between States to create a Transition" HelpKeyword="ConnectExampleRelationF1Keyword">
        <ConnectionBuilderMoniker Name="NavigationLanguage/TransitionBuilder" />
      </ConnectionTool>
    </ToolboxTab>
    <Validation UsesMenu="true" UsesOpen="true" UsesSave="true" UsesLoad="false" />
    <DiagramMoniker Name="NavigationLanguageDiagram" />
  </Designer>
  <Explorer ExplorerGuid="2203b6fe-74d7-45c1-ab06-39db0f96d206" Title="NavigationLanguage Explorer">
    <ExplorerBehaviorMoniker Name="NavigationLanguage/NavigationLanguageExplorer" />
  </Explorer>
</Dsl>