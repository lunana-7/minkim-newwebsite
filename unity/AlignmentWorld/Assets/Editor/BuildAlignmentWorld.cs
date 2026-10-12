using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

public static class BuildAlignmentWorld {
 [MenuItem("Alignment World/Build Web Player")]
 public static void Build(){
  string project=Path.GetFullPath(Path.Combine(Application.dataPath,".."));
  string output=Path.GetFullPath(Path.Combine(project,"../../public/alignment-world/Unity"));
  Directory.CreateDirectory("Assets/Scenes");var scene=EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects,NewSceneMode.Single);EditorSceneManager.SaveScene(scene,"Assets/Scenes/Lumen.unity");
  foreach(string guid in AssetDatabase.FindAssets("t:Texture2D",new[]{"Assets/Resources"})){string path=AssetDatabase.GUIDToAssetPath(guid);var importer=(TextureImporter)AssetImporter.GetAtPath(path);importer.filterMode=FilterMode.Point;importer.textureCompression=TextureImporterCompression.Uncompressed;importer.alphaIsTransparency=true;importer.mipmapEnabled=false;importer.SaveAndReimport();}
  PlayerSettings.WebGL.compressionFormat=WebGLCompressionFormat.Disabled;
  var result=BuildPipeline.BuildPlayer(new BuildPlayerOptions{scenes=new[]{"Assets/Scenes/Lumen.unity"},locationPathName=output,target=BuildTarget.WebGL,options=BuildOptions.None});
  if(result.summary.result!=BuildResult.Succeeded)throw new System.Exception("Unity Web build failed: "+result.summary.result);
  File.WriteAllText(Path.Combine(output,"../unity-manifest.json"),"{\"ready\":true,\"loaderUrl\":\"/alignment-world/Unity/Build/Unity.loader.js\",\"config\":{\"dataUrl\":\"/alignment-world/Unity/Build/Unity.data\",\"frameworkUrl\":\"/alignment-world/Unity/Build/Unity.framework.js\",\"codeUrl\":\"/alignment-world/Unity/Build/Unity.wasm\",\"streamingAssetsUrl\":\"/alignment-world/Unity/StreamingAssets\",\"companyName\":\"Min Kim\",\"productName\":\"Alignment World\",\"productVersion\":\"0.1.0\"}}");
 }
}
