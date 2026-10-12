using System;
using System.Runtime.InteropServices;
using UnityEngine;

[Serializable] public class Campaign { public string title,subtitle,premise; public Chapter[] chapters; }
[Serializable] public class Chapter { public string id,name,host,art,npc,term,concept,story,question,feedback,career,source; public string[] options; public int correct; }
[Serializable] public class WorldSave { public string uid; public int region,mask,xp; public float x=100; }

// The authenticated website owns login, cloud persistence and session validity.
public sealed class AlignmentSession : MonoBehaviour {
 [DllImport("__Internal")] static extern void AlignmentProgress(string json);
 Campaign campaign; WorldSave state=new WorldSave(); Texture2D[] backgrounds,npcs,walk; float height,verticalSpeed; int facing=1; float savedAt; bool dialogue; string feedback=""; GUIStyle title,text,button; Vector2 dialogueScroll;
 [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)] static void Boot(){ if(FindFirstObjectByType<AlignmentSession>()==null)new GameObject("AlignmentSession").AddComponent<AlignmentSession>(); }
 void Awake(){campaign=JsonUtility.FromJson<Campaign>(Resources.Load<TextAsset>("campaign").text);backgrounds=new Texture2D[campaign.chapters.Length];npcs=new Texture2D[campaign.chapters.Length];for(int i=0;i<backgrounds.Length;i++){backgrounds[i]=Resources.Load<Texture2D>("region-"+i);npcs[i]=Resources.Load<Texture2D>("npc-"+i);}walk=new Texture2D[6];for(int i=0;i<6;i++)walk[i]=Resources.Load<Texture2D>("walk-"+i);foreach(var image in walk)if(image)image.filterMode=FilterMode.Point;Application.targetFrameRate=60;}
 public void SetSession(string json){if(string.IsNullOrEmpty(json)){state=new WorldSave();dialogue=false;return;}state=JsonUtility.FromJson<WorldSave>(json);state.region=Mathf.Clamp(state.region,0,5);state.mask=Mathf.Clamp(state.mask,0,63);state.x=Mathf.Clamp(state.x,30,2100);height=0;verticalSpeed=0;}
 bool SignedIn=>!string.IsNullOrEmpty(state.uid);
 bool Unlocked(int i)=>i==0||(i<6&&(state.mask&(1<<(i-1)))!=0);
 public void Travel(string id){if(!SignedIn||!int.TryParse(id,out int i)||!Unlocked(i)||i<0||i>5)return;state.region=i;state.x=100;dialogue=false;Persist();}
 void Update(){if(!SignedIn)return;if(Time.time-savedAt>5){savedAt=Time.time;Persist();}if(dialogue)return;float d=(Input.GetKey(KeyCode.D)||Input.GetKey(KeyCode.RightArrow)?1:0)-(Input.GetKey(KeyCode.A)||Input.GetKey(KeyCode.LeftArrow)?1:0);state.x=Mathf.Clamp(state.x+d*230*Time.deltaTime,30,2100);if(d!=0)facing=d>0?1:-1;if(Input.GetKeyDown(KeyCode.Space)&&height==0)verticalSpeed=410;height=Mathf.Max(0,height+verticalSpeed*Time.deltaTime);verticalSpeed-=1000*Time.deltaTime;if(height==0)verticalSpeed=0;if(Input.GetKeyDown(KeyCode.E)&&Mathf.Abs(state.x-900)<180)dialogue=true;if(state.x>2050&&state.region<5&&Unlocked(state.region+1))Travel((state.region+1).ToString());}
 void Persist(){
 #if UNITY_WEBGL && !UNITY_EDITOR
 AlignmentProgress(JsonUtility.ToJson(state));
 #endif
 }
 void Styles(){if(title!=null)return;title=new GUIStyle(GUI.skin.label){fontSize=27,normal={textColor=new Color(.95f,.94f,.83f)}};text=new GUIStyle(GUI.skin.label){fontSize=17,wordWrap=true,normal={textColor=Color.white}};button=new GUIStyle(GUI.skin.button){fontSize=16,wordWrap=true};}
 void OnGUI(){if(campaign==null)return;Styles();GUI.matrix=Matrix4x4.TRS(Vector3.zero,Quaternion.identity,new Vector3(Screen.width/960f,Screen.height/680f,1));var c=campaign.chapters[state.region];float camera=Mathf.Clamp(state.x-350,0,1240);if(backgrounds[state.region])GUI.DrawTexture(new Rect(0,0,960,540),backgrounds[state.region],ScaleMode.ScaleAndCrop);GUI.color=new Color(.05f,.12f,.2f,.5f);GUI.DrawTexture(new Rect(0,0,960,540),Texture2D.whiteTexture);GUI.color=Color.white;GUI.Label(new Rect(24,16,800,40),c.name,title);GUI.Label(new Rect(24,57,880,36),"The Lantern Protocol · A / D: move · Space: jump · E: speak to the guide",text);
 if(npcs[state.region])GUI.DrawTexture(new Rect(884-camera,374,94,94),npcs[state.region],ScaleMode.ScaleToFit);GUI.Label(new Rect(870-camera,341,160,28),c.host.Split('·')[0],text);GUI.color=new Color(.6f,.8f,.85f,.65f);GUI.DrawTexture(new Rect(2030-camera,363,55,105),Texture2D.whiteTexture);GUI.color=Color.white;GUI.Label(new Rect(2010-camera,330,170,28),"Next beacon →",text);
 bool moving=SignedIn&&!dialogue&&(Input.GetKey(KeyCode.A)||Input.GetKey(KeyCode.D)||Input.GetKey(KeyCode.LeftArrow)||Input.GetKey(KeyCode.RightArrow));int frame=moving?(int)(Time.time/.12f)%6:0;if(walk[frame]){var rect=new Rect(state.x-camera-16,468-height-94,94,94);if(facing<0){GUIUtility.ScaleAroundPivot(new Vector2(-1,1),rect.center);GUI.DrawTexture(rect,walk[frame],ScaleMode.ScaleToFit);GUIUtility.ScaleAroundPivot(new Vector2(-1,1),rect.center);}else GUI.DrawTexture(rect,walk[frame],ScaleMode.ScaleToFit);}
 GUILayout.BeginArea(new Rect(16,550,928,120));GUILayout.BeginHorizontal();for(int i=0;i<6;i++){GUI.enabled=SignedIn&&Unlocked(i);int target=i;if(GUILayout.Button((i+1)+". "+campaign.chapters[i].name,button,GUILayout.Height(54)))Travel(target.ToString());}GUILayout.EndHorizontal();GUI.enabled=SignedIn;if(GUILayout.Button("Talk to your guide / E",button,GUILayout.Height(38))&&Mathf.Abs(state.x-900)<180)dialogue=true;GUI.enabled=true;GUILayout.EndArea();
 if(!SignedIn){GUI.Box(new Rect(195,170,570,210),"");GUI.Label(new Rect(225,198,520,60),"Sign in on the website to enter Lumen",title);GUI.Label(new Rect(225,275,510,65),"Your Google session and story save are managed by the host page.",text);}
 if(dialogue){GUI.Box(new Rect(85,90,790,450),"");GUILayout.BeginArea(new Rect(110,110,740,410));dialogueScroll=GUILayout.BeginScrollView(dialogueScroll);GUILayout.Label(c.term,title);GUILayout.Label(c.story,text);GUILayout.Label(c.concept,text);GUILayout.Label(c.question,text);for(int i=0;i<c.options.Length;i++){int choice=i;if(GUILayout.Button(c.options[i],button,GUILayout.MinHeight(39))){if(choice==c.correct){if((state.mask&(1<<state.region))==0){state.mask|=1<<state.region;state.xp+=100;Persist();}feedback=c.feedback;}else feedback="Revisit the concept: this response leaves a gap.";}}GUILayout.Label(feedback,text);GUILayout.BeginHorizontal();if(GUILayout.Button("Read primary source",button))Application.OpenURL(c.source);if(GUILayout.Button("Return to the world",button))dialogue=false;GUILayout.EndHorizontal();GUILayout.EndScrollView();GUILayout.EndArea();}
 }
}
