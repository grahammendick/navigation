using Navigation;
using System;
using System.Reflection;
using System.Resources;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.UI;

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("Navigation")]
[assembly: AssemblyDescription("Navigation for ASP.NET is a unique take on state management in ASP.NET applications that puts the Url back into the WUrld Wide Web.")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("Graham Mendick")]
[assembly: AssemblyProduct("Navigation")]
[assembly: AssemblyCopyright("")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

// Setting ComVisible to false makes the types in this assembly not visible 
// to COM components.  If you need to access a type in this assembly from 
// COM, set the ComVisible attribute to true on that type.
[assembly: ComVisible(false)]

// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("7d1b097a-976a-4106-8d8e-8d215340206d")]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers 
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.10.0.0")]
[assembly: AssemblyFileVersion("1.10.0.0")]

[assembly: CLSCompliant(true)]
[assembly: NeutralResourcesLanguageAttribute("en-GB", UltimateResourceFallbackLocation.MainAssembly)]
#if NET35Plus
[assembly: WebResource("Navigation.HTML5History.js", "text/javascript")]
[assembly: WebResource("Navigation.HTML5History.debug.js", "text/javascript")]
#endif
#if NET40Plus
[assembly: PreApplicationStartMethod(typeof(StateInfoConfig), "AddStateRoutes")]
#endif
