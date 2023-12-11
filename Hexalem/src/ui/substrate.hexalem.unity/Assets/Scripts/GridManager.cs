using UnityEngine;

namespace Assets.Scripts
{
    public class GridManager : Singleton<GridManager>
    {
        public delegate void TileClickHandler(GameObject tileObject, int index);

        public event TileClickHandler OnGridTileClicked;

        [SerializeField]
        public GameObject PlayerGrid;

        [SerializeField]
        private GameObject _emptyTile;

        [SerializeField]
        private GameObject _homeTile;

        [SerializeField]
        private GameObject _grassTile;

        [SerializeField]
        private GameObject _waterTile;

        [SerializeField]
        private GameObject _mountainTile;

        [SerializeField]
        private GameObject _forestTile;

        [SerializeField]
        private GameObject _desertTile;

        [SerializeField]
        private GameObject _caveTile;

        private void Update()
        {
            // Check if the left mouse button was clicked
            if (Input.GetMouseButtonDown(0))
            {
                // Create a ray from the camera to the mouse cursor
                Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

                // Perform the raycast
                if (Physics.Raycast(ray, out RaycastHit hit) && hit.transform.parent != null && hit.transform.parent.name.StartsWith('t'))
                {
                    // If the raycast hit a game object with a collider, log the name
                    var tileObject = hit.transform.gameObject;
                    var index = int.Parse(tileObject.transform.parent.name[1..]);

                    Debug.Log($"Clicked on {tileObject.name} [{index}]");

                    OnGridTileClicked?.Invoke(tileObject, index);
                }
            }
        }
    }
}