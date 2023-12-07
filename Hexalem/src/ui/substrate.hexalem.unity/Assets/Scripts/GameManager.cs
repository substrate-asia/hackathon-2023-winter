using Assets.Scripts;
using Assets.Scripts.Shared;
using Substrate.Hexalem;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using static Assets.Scripts.ScreensSubState.MainPlaySubState;
using static Assets.Scripts.ScreenStates.MainScreenState;
using static UnityEngine.GraphicsBuffer;

public class GameManager : MonoBehaviour
{
    [SerializeField]
    private GameObject _playerGrid;
    private List<MeshRenderer> _tileDefaultMesh;

    [SerializeField]
    private GameObject _selection;

    public GameObject EmptyTile;
    public GameObject HomeTile;
    public GameObject GrassTile;
    public GameObject WaterTile;
    public GameObject MountainTile;
    public GameObject ForestTile;
    public GameObject DesertTile;
    public GameObject CaveTile;

    private Vector3 _prefabPosition;

    private int? _selectionIndex = null;
    private int? _boardIndex = null;
    public static HexaGame HexaGame;

    public GameManager()
    {
        _prefabPosition = new Vector3(0, 0, 0);
    }

    // Start is called before the first frame update
    void Start()
    {
        GameEventManager.StartNewGameDelegate += StartNewGame;
        GameEventManager.ZoomHandlerDelegate += OnTileDetails;
    }

    public void OnZoom(bool zoomIn)
    {
        //if (Input.GetMouseButtonDown(0))
        //{
        //    Debug.Log("Zoom !");

        //    transform.LookAt(_playerGrid.transform.GetChild(12).GetChild(0).gameObject.transform);

        //    Camera.main.orthographicSize = Mathf.Clamp(Camera.main.orthographicSize, 4, 6);
        //    //float fov = Camera.main.fieldOfView;
        //    //fov += Input.GetAxis("Mouse ScrollWheel") * 10f;
        //    //fov = Mathf.Clamp(fov, 10f, 90f);
        //    //Camera.main.fieldOfView = fov;
        //}
    }

    void HandleSelectionAction()
    {
        var selectionIndex = TilesHelper.GetTargetIndex("selection_");

        if (selectionIndex != null)
        {
            _selectionIndex = selectionIndex;
            Debug.Log($"Selection tile num {_selectionIndex} clicked !");
        }
    }

    /// <summary>
    /// Put a selected tile on the board
    /// </summary>
    public void HandleBoardAction()
    {
        var boardIndex = TilesHelper.GetTargetIndex("board_");

        if(boardIndex != null)
        {
            _boardIndex = boardIndex;
            Debug.Log($"Board tile num {_boardIndex.Value} clicked !");

            var currentBoard = HexaGame.HexaTuples[HexaGame.PlayerTurn].board;
            var tile = (HexaTile)currentBoard[_boardIndex.Value];

            // If we have currently selected a selection tile, we can put it on the map
            if (_selectionIndex != null)
            {
                Debug.Log($"Play tile selection num {_selectionIndex.Value} on tile board num {_boardIndex}");

                HexaGame = Game.ChooseAndPlace(1, HexaGame, HexaGame.PlayerTurn, _selectionIndex.Value, HexaGame.HexaTuples[HexaGame.PlayerTurn].board.ToCoords(_boardIndex.Value));

                _selectionIndex = null;

                DrawSelection(HexaGame.UnboundTiles, HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
                DrawBoard(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);
                PlayerPlayed();
            }
            else if (tile.CanUpgrade())
            {
                Debug.Log($"Upgrade tile board num {_boardIndex.Value}");

                var mr = _playerGrid.transform.GetChild(_boardIndex.Value).GetChild(0).gameObject.GetComponent<MeshRenderer>();

                if (!TileAlreadySelected(mr))
                    SelectTile(_playerGrid, mr);
                else
                {
                    Debug.Log($"Unselect tile {_boardIndex.Value}");
                    UnselectTile(_boardIndex.Value, mr);
                    _boardIndex = null;
                }
            } else
            {
                Debug.Log($"Else... {_boardIndex}");
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        HandleSelectionAction();
        HandleBoardAction();
    }

    void StartNewGame(string gameType)
    {
        if (gameType == "training")
        {
            Debug.Log("Start a new training game");

            HexaGame = Game.CreateGame(1, new List<HexaPlayer>() { new HexaPlayer(new byte[32]) }, GridSize.Medium);

            DrawSelection(HexaGame.UnboundTiles, HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
            DrawBoard(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);

            GameEventManager.GetInstance().OnRessourcesChanged(HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
            //GameEventManager.GetInstance().OnVisualGameHelperChanged(2000, StateType.GameStarted);

        }
        else if (gameType == "local")
        {
            Debug.Log("Start a new local game (vs bots)");

        }
        else
        {
            Debug.Log("Start a new Pvp game");

        }
    }

    public void PlayerPlayed()
    {
        // Check if player can continue to play
        if(HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Mana] == 0) // My CanPlay() is not accessible I don't know why ...
        {
            HexaGame = Game.FinishTurn(2, HexaGame, HexaGame.PlayerTurn);
            //GameEventManager.GetInstance().OnVisualGameHelperChanged(2000, StateType.CalcReward);
        }
    }

    /// <summary>
    /// Draw selection tiles
    /// </summary>
    /// <param name="tiles"></param>
    /// <param name="player"></param>
    public void DrawSelection(List<HexaTile> tiles, HexaPlayer player)
    {
        for (int i = 0; i < _selection.transform.childCount; i++)
        {
            if (_selection.transform.GetChild(i).childCount > 0)
            {
                Destroy(_selection.transform.GetChild(i).GetChild(0).gameObject);
            }
        }

        for (int i = 0; i < tiles.Count; i++)
        {
            var selectionTile = Instantiate(GetTile(tiles[i]), _prefabPosition, Quaternion.identity);

            selectionTile.transform.parent = _selection.transform.GetChild(i);
            selectionTile.transform.localPosition = _prefabPosition;

            selectionTile.name = $"selection_{i}";

            // If the player does not have enough money to buy tile, put it transparent
            if (!player.CanBuy(tiles[i]))
            {
                var initialColor = selectionTile.GetComponent<Renderer>().material.color;
                selectionTile.GetComponent<Renderer>().material.color = new Color(initialColor.r, initialColor.g, initialColor.b, 0.4f);
            }
        }
    }

    /// <summary>
    /// Draw current board
    /// </summary>
    /// <param name="board"></param>
    public void DrawBoard(HexaBoard board)
    {
        // Clear the selection before build a new one
        for (int i = 0; i < _playerGrid.transform.childCount; i++)
        {
            if (_playerGrid.transform.GetChild(i).childCount > 0)
            {
                Destroy(_playerGrid.transform.GetChild(i).GetChild(0).gameObject);
            }
        }

        _tileDefaultMesh = new List<MeshRenderer>();

        for (int i = 0; i < board.Value.Length; i++)
        {
            var tile = (HexaTile)board.Value[i];

            var boardTile = Instantiate(GetTile(tile), _prefabPosition, Quaternion.identity);
            _tileDefaultMesh.Add(boardTile.GetComponent<MeshRenderer>());

            // We don't draw tiles where we cannot play
            if (tile.IsEmpty() && !board.CanPlace(board.ToCoords(i))) continue;

            boardTile.transform.parent = _playerGrid.transform.GetChild(i);
            boardTile.transform.localPosition = _prefabPosition;

            boardTile.name = $"board_{i}";
        }
    }

    public GameObject GetTile(HexaTile tile)
    {
        switch (tile.TileType)
        {
            case TileType.Empty: return EmptyTile;
            case TileType.Home: return HomeTile;
            case TileType.Grass: return GrassTile;
            case TileType.Water: return WaterTile;
            case TileType.Mountain: return MountainTile;
            case TileType.Forest: return ForestTile;
            case TileType.Desert: return DesertTile;
            case TileType.Cave: return CaveTile;
        }

        throw new InvalidOperationException($"Tile {tile} is not mapped to prefab tiles");
    }

    #region Tile Mesh

    public bool TileAlreadySelected(MeshRenderer mr)
    {
        return mr.material.color == GameConstant.ColorTileSelected;
    }

    public void UnselectAll(GameObject _grid)
    {
        for (int i = 0; i < _grid.transform.childCount; i++)
        {
            if (_grid.transform.GetChild(i).childCount > 0)
            {
                UnselectTile(i, _grid.transform.GetChild(i).GetChild(0).gameObject.GetComponent<MeshRenderer>());
            }
        }
    }

    public void SelectTile(GameObject _grid, MeshRenderer mr)
    {
        UnselectAll(_grid);

        mr.material.color = GameConstant.ColorTileSelected;

    }

    public void UnselectTile(int i, MeshRenderer mr)
    {
        mr.material.color = _tileDefaultMesh[i].material.color;
    }

    #endregion
}
