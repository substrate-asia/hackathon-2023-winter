using Substrate.Hexalem.Engine;
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
        private GameObject _treesTile;

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

        public void CreateGrid(HexaBoard hexaBoard)
        {
            for(int i = 0; i < hexaBoard.Value.Length; i++)
            {
                HexaTile tile = hexaBoard.Value[i];

                var gridParent = PlayerGrid.transform.GetChild(i);

                // remove previous game objects connected to the grid
                foreach (Transform child in gridParent.transform)
                {
                    Destroy(child.gameObject);
                }

                GameObject newTile;
                switch (tile.TileType)
                {
                    case TileType.Empty:
                        newTile = Instantiate(_emptyTile, gridParent);
                        break;
                    case TileType.Home:
                        newTile = Instantiate(_homeTile, gridParent);
                        break;
                    case TileType.Grass:
                        newTile = Instantiate(_grassTile, gridParent);
                        break;
                    case TileType.Water:
                        newTile = Instantiate(_waterTile, gridParent);
                        break;
                    case TileType.Mountain:
                        newTile = Instantiate(_mountainTile, gridParent);
                        break;
                    case TileType.Tree:
                        newTile = Instantiate(_treesTile, gridParent);
                        break;
                    case TileType.Desert:
                        newTile = Instantiate(_desertTile, gridParent);
                        break;
                    case TileType.Cave:
                        newTile = Instantiate(_caveTile, gridParent);
                        break;
                }
            }
        }
    }
}