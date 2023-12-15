using Substrate.NET.Wallet;
using System.IO;
using UnityEngine;

namespace Assets.Scripts
{
    public class CachingManager : Singleton<CachingManager>
    {
        private string _persistentPath;

        public string PersistentPath => _persistentPath;

        protected override void Awake()
        {
            base.Awake();

            _persistentPath = Application.persistentDataPath;
            SystemInteraction.ReadData = f => UnityMainThreadDispatcher.Dispatch(() => Resources.Load<TextAsset>(Path.GetFileNameWithoutExtension(f)).text);
            SystemInteraction.DataExists = f => UnityMainThreadDispatcher.Dispatch(() => Resources.Load(Path.GetFileNameWithoutExtension(f))) != null;
            SystemInteraction.PersistentExists = f => File.Exists(Path.Combine(_persistentPath, f));
            SystemInteraction.ReadPersistent = f => File.ReadAllText(Path.Combine(_persistentPath, f));
            SystemInteraction.Persist = (f, c) => File.WriteAllText(Path.Combine(_persistentPath, f), c);

            Debug.Log(_persistentPath);
        }
    }
}