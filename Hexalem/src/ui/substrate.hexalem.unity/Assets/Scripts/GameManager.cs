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
using static UnityEditor.PlayerSettings;
using static UnityEngine.GraphicsBuffer;

public class GameManager : MonoBehaviour
{
    [SerializeField]
    private GameObject _playerGrid;
    private List<MeshRenderer> _tileDefaultMesh;

    [SerializeField]
    private GameObject _selection;

    public GameObject EmptyTile;
    public GameObject HomeTileStandard;
    public GameObject HomeTileRare;
    public GameObject GrassTile;
    public GameObject WaterTile;
    public GameObject MountainTile;
    public GameObject ForestTile;
    public GameObject DesertTile;
    public GameObject CaveTile;

    private Vector3 _prefabPosition;

    private int? _selectionIndex = null;
    private int? _boardIndex = null;
    private Vector3 _initialCameraPosition;
    public static HexaGame HexaGame;

    public GameManager()
    {
        _prefabPosition = new Vector3(0, 0, 0);
    }

    // Start is called before the first frame update
    void Start()
    {
        GameEventManager.StartNewGameDelegate += StartNewGame;
        GameEventManager.ZoomHandlerDelegate += OnZoom;
        GameEventManager.UpgradeTileHandlerDelegate += OnUpgradeTile;
    }

    public void OnUpgradeTile((int, int) coords)
    {
        var tile = (HexaTile)HexaGame.HexaTuples[HexaGame.PlayerTurn].board[coords.Item1, coords.Item2];
        if(tile.CanUpgrade())
        {
            HexaGame = Game.Upgrade(1, HexaGame, HexaGame.PlayerTurn, coords);

            Debug.Log($"Tile [{coords.Item1},{coords.Item2}] upgraded to {tile.TileRarity}");

            // After upgrading the tile, close the UI detail
            GameEventManager.GetInstance().OnTileDetails(false, coords, null, false);
            DrawBoard(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);

            GameEventManager.GetInstance().OnVisualGame(2000, StateType.TileUpgradeSucceed);
        }
        else
        {
            Debug.Log($"Not able to upgrade tile on [{coords.Item1} ,{coords.Item2}]");
        }
    }

    public void OnZoom(bool zoomIn)
    {
        
        var target = _playerGrid.transform.GetChild(12).GetChild(0).gameObject;

        if(zoomIn)
        {
            Debug.Log("Zoom in !");
            Unity3DZoomFit.ZoomFit(Camera.main, target);
        }
        else
        {
            Debug.Log("Zoom out !");
            Camera.main.transform.position = _initialCameraPosition;
        }
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
    /// Handle all possible actions on the board :
    ///     - Put a selected tile on the board
    ///     - Highlight a selected tile
    /// </summary>
    public void HandleBoardAction()
    {
        var boardIndex = TilesHelper.GetTargetIndex("board_");

        if (boardIndex != null)
        {
            _boardIndex = boardIndex;
            Debug.Log($"Board tile num {_boardIndex.Value} clicked !");

            var currentBoard = HexaGame.HexaTuples[HexaGame.PlayerTurn].board;
            var tile = (HexaTile)currentBoard[_boardIndex.Value];
            var coords = HexaGame.HexaTuples[HexaGame.PlayerTurn].board.ToCoords(_boardIndex.Value);

            // If we have currently selected a selection tile, we can put it on the map
            if (_selectionIndex != null && currentBoard.CanPlace(coords))
            {
                Debug.Log($"Play tile selection num {_selectionIndex.Value} on tile board num {_boardIndex}");

                HexaGame = Game.ChooseAndPlace(1, HexaGame, HexaGame.PlayerTurn, _selectionIndex.Value, coords);

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
                {
                    SelectTile(_playerGrid, mr);
                    GameEventManager.GetInstance().OnTileDetails(true, coords, tile, true);
                }
                else
                {
                    Debug.Log($"Unselect tile {_boardIndex.Value}");
                    UnselectTile(_boardIndex.Value, mr);
                    GameEventManager.GetInstance().OnTileDetails(false, coords, tile, true);
                    _boardIndex = null;
                }
            }
            else
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

            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Mana] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Humans] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Food] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Gold] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Wood] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Stone] = 10;
            HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Water] = 10;

            DrawSelection(HexaGame.UnboundTiles, HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
            DrawBoard(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);

            _initialCameraPosition = Camera.main.transform.position;


            GameEventManager.GetInstance().OnRessourcesChanged(HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
            GameEventManager.GetInstance().OnVisualGame(2000, StateType.GameStarted);

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
        if (HexaGame.HexaTuples[HexaGame.PlayerTurn].player[RessourceType.Mana] == 0) // My CanPlay() is not accessible I don't know why ...
        {
            HexaGame = Game.FinishTurn(2, HexaGame, HexaGame.PlayerTurn);
            GameEventManager.GetInstance().OnVisualGame(2000, StateType.CalcReward);
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

            // Map tile to prefab
            var generatedTile = GetTile(tile);

            // Save tile material (for select / unselect purpose)
            _tileDefaultMesh.Add(generatedTile.GetComponent<MeshRenderer>());

            // We don't draw tiles where we cannot play
            if (tile.IsEmpty() && !board.CanPlace(board.ToCoords(i))) continue;

            // Build a new tile
            var boardTile = Instantiate(generatedTile, _prefabPosition, Quaternion.identity);

            boardTile.transform.parent = _playerGrid.transform.GetChild(i);
            boardTile.transform.localPosition = _prefabPosition;

            boardTile.name = $"board_{i}";
        }
    }

    public GameObject GetTile(HexaTile tile)
    {
        GameObject? obj = null;
        switch (tile.TileType)
        {
            case TileType.Empty: obj = EmptyTile; break;
            case TileType.Home: 
                obj = (tile.TileRarity == TileRarity.Rare) ? HomeTileRare : HomeTileStandard; break;
            case TileType.Grass: obj = GrassTile; break;
            case TileType.Water: obj = WaterTile; break;
            case TileType.Mountain: obj = MountainTile; break;
            case TileType.Forest: obj = ForestTile; break;
            case TileType.Desert: obj = DesertTile; break;
            case TileType.Cave: obj = CaveTile; break;
        }

        if (obj != null)
        {
            return obj;
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
        mr.material.color = _tileDefaultMesh[i].sharedMaterial.color;
    }

    #endregion
}
