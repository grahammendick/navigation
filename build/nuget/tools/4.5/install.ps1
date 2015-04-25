param($rootPath, $toolsPath, $package, $project)

if ($project.Type -eq "VB.NET") {
	$project.ProjectItems.Item("App_Start").ProjectItems.Item("FluentStateInfoConfig.cs").Delete()
}
if ($project.Type -eq "C#") {
	$project.ProjectItems.Item("App_Start").ProjectItems.Item("FluentStateInfoConfig.vb").Delete()
}
