#region Using directives

using System;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Runtime.ConstrainedExecution;

#endregion

//
// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
//
[assembly: AssemblyTitle(@"")]
[assembly: AssemblyDescription(@"")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany(@"Navigation")]
[assembly: AssemblyProduct(@"Navigation Diagram")]
[assembly: AssemblyCopyright("")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]
[assembly: System.Resources.NeutralResourcesLanguage("en")]

//
// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Revision and Build Numbers 
// by using the '*' as shown below:

[assembly: AssemblyVersion(@"1.0.0.0")]
[assembly: ComVisible(false)]
[assembly: CLSCompliant(true)]
[assembly: ReliabilityContract(Consistency.MayCorruptProcess, Cer.None)]

//
// Make the Dsl project internally visible to the DslPackage assembly
//
[assembly: InternalsVisibleTo(@"Navigation.Designer.DslPackage, PublicKey=0024000004800000940000000602000000240000525341310004000001000100294B467FD4179DA97DEB15D22B44052F37E229CEAE4F0E015CE131367FBE4ADBCC17DCFB4A866AC04666F84CBCF2CEC7907061690BB981AC01EB6CC0C4B5D4DF4AB4BF00CE930A1950B22EAB2B8B0DFC6C2276BCE14E3AA83375BBB9E44D3BCF874AA7EB7666E509D4CF38AA107EFBCFBE9BD3492184DCC3258E30D5BB548AAF")]