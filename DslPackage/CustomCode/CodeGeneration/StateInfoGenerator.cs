using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.VisualStudio.TextTemplating.VSHost;
using Navigation.Designer.CustomCode.CodeGeneration;

namespace Navigation.Designer
{
	[Guid("44BB46AD-9FE9-4F11-8080-4E68F8856C14")]
	public class StateInfoGenerator : TemplatedCodeGenerator
	{
		protected override byte[] GenerateCode(string inputFileName, string inputFileContent)
		{
			inputFileContent = ASCIIEncoding.UTF8.GetString(Resources.StateInfo);
			FileInfo fi = new FileInfo(inputFileName);
			inputFileContent = inputFileContent.Replace("[filename]", fi.Name);
			byte[] data = base.GenerateCode(inputFileName, inputFileContent);
			byte[] ascii = new byte[data.Length - 3];
			Array.Copy(data, 3, ascii, 0, data.Length - 3);
			return ascii;
		}
	}
}
