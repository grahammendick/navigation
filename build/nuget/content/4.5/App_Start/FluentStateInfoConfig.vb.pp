Imports Navigation

<Assembly: WebActivatorEx.PreApplicationStartMethod(
    GetType(FluentStateInfoConfig), "Register")> 
Public Module FluentStateInfoConfig
    ''' <summary>
    ''' This method is where you configure your navigation. You can find out more
    ''' about it by heading over to http://navigation.codeplex.com/documentation
    ''' To get you started here's an example
    ''' </summary>
    Public Sub Register()
        'StateInfoConfig.Fluent.
        '    Dialog("Thingamabob", New With
        '    {
        '        .Listing = New WebFormsState("listing", "~/Listing.aspx"),
        '        .Details = New MvcState("details", "Thingamabob", "Details")
        '    }, Function(d) d.Listing).
        '        Transition("Select", Function(d) d.Listing, Function(d) d.Details).
        '    Build()
    End Sub
End Module
