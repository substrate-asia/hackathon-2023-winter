using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using UnityEngine.UIElements;
using System.Threading.Tasks;

public class SceneLoader : MonoBehaviour
{
    //public Slider progressBar;
    //public Text progressText;

    void Start()
    {
        // Start asynchronous loading of the main scene
        _ = LoadMainSceneAsync();
    }

    async Task LoadMainSceneAsync()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        var velBackDrop = root.Q<VisualElement>("VelProgress");

        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync("MainScene"); // Replace with your main scene name
        asyncLoad.allowSceneActivation = false;

        while (!asyncLoad.isDone)
        {
            float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
            velBackDrop.style.height = new Length(progress * 100, LengthUnit.Percent);

            // Check if the load has finished
            if (asyncLoad.progress >= 0.9f)
            {
                asyncLoad.allowSceneActivation = true;
            }

            // Await a small delay to prevent this loop from blocking the main thread
            await Task.Delay(100);
        }
    }
}
