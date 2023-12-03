using Assets.Scripts;
using Substrate.Hexalem;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;
using static Assets.Scripts.ScreenStates.MainScreenState;

public class GameManager : MonoBehaviour
{
    [SerializeField]
    private GameObject _playerGrid;

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

    private TemplateContainer _mainInstance;
    public static HexaGame HexaGame;

    public GameManager()
    {
        _prefabPosition = new Vector3(0, 0, 0);
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("GameManager called");

        

        for (int i = 0; i < _playerGrid.transform.childCount; i++)
        {
            Destroy(_playerGrid.transform.GetChild(i).GetChild(0).gameObject);
        }

        GameEventManager.StartNewGameDelegate += StartNewGame;
    }

    void HandleSelectedTileFromSelection()
    {
        if (HexaGame != null && Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                //Select stage    
                if (hit.transform.name.StartsWith("selection_"))
                {
                    //SceneManager.LoadScene("SceneTwo");
                    var idx = new String(hit.transform.name.Where(Char.IsDigit).ToArray());
                    _selectionIndex = int.Parse(idx);
                    Debug.Log($"Selection tile num {_selectionIndex} clicked !");

                    var mr = _selection.transform.GetChild(_selectionIndex.Value).GetChild(0).gameObject.GetComponent<MeshRenderer>();
                    mr.material.color = Color.red;
                }
            }
        }
    }

    /// <summary>
    /// Put a selected tile on the board
    /// </summary>
    public void HandlePutSelectionTileOnBoard()
    {
        // If we have currently selected a selection tile, we can put it on the map
        if (HexaGame != null && _selectionIndex != null && Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                //Select stage    
                if (hit.transform.name.StartsWith("board_"))
                {
                    var idx = new String(hit.transform.name.Where(Char.IsDigit).ToArray());
                    var boardIndex = int.Parse(idx);
                    var currentBoard = HexaGame.HexaTuples[HexaGame.PlayerTurn].board;
                    //_playerGrid.transform.GetChild(boardIndex).GetChild(0).gameObject = _playerGrid.transform.GetChild(_selectionIndex.Value).GetChild(0).gameObject;

                    
                    // Is it possible to play on this tile ?
                    if (currentBoard.CanPlace(currentBoard.ToCoords(boardIndex))) {
                        Debug.Log($"Play tile selection num {_selectionIndex.Value} on tile board num {boardIndex}");

                        HexaGame = Game.ChooseAndPlace(1, HexaGame, HexaGame.PlayerTurn, _selectionIndex.Value, HexaGame.HexaTuples[HexaGame.PlayerTurn].board.ToCoords(boardIndex));

                        _selectionIndex = null;

                        LoadSelection(HexaGame.UnboundTiles);
                        LoadMap(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);
                    } else
                    {
                        Debug.Log($"Unable to play tile selection num {_selectionIndex.Value} on tile board num {boardIndex}");
                    }
                    
                }
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        HandleSelectedTileFromSelection();
        HandlePutSelectionTileOnBoard();
    }

    void StartNewGame(string gameType)
    {
        if (gameType == "training")
        {
            Debug.Log("Start a new training game");

            HexaGame = Game.CreateGame(1, new List<HexaPlayer>() { new HexaPlayer(new byte[32]) }, GridSize.Medium);

            LoadSelection(HexaGame.UnboundTiles);
            LoadMap(HexaGame.HexaTuples[HexaGame.PlayerTurn].board);

            GameEventManager.GetInstance().OnRessourcesChanged(HexaGame.HexaTuples[HexaGame.PlayerTurn].player);
            GameEventManager.GetInstance().OnVisualGameHelperChanged(1000, StateType.GameStarted);

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

    public void LoadSelection(List<HexaTile> tiles)
    {
        // Clear the selection before build a new one
        for (int i = 0; i < _playerGrid.transform.childCount; i++)
        {
            if(_playerGrid.transform.GetChild(i).childCount > 0)
            {
                Destroy(_playerGrid.transform.GetChild(i).GetChild(0).gameObject);
            }
        }


        for (int i = 0; i < tiles.Count; i++)
        {
            var selectionTile = Instantiate(GetTile(tiles[i]), _prefabPosition, Quaternion.identity);

            selectionTile.transform.parent = _selection.transform.GetChild(i);
            selectionTile.transform.localPosition = _prefabPosition;

            selectionTile.name = $"selection_{i}";
            //var dragAndDrop = selectionTile.AddComponent<Assets.Scripts.Shared.DragAndDrop>();
        }
    }

    public GameObject GetTile(HexaTile tile)
    {
        switch (tile.TileType)
        {
            case TileType.None: return EmptyTile;
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

    public void LoadMap(HexaBoard board)
    {
        for (int i = 0; i < _selection.transform.childCount; i++)
        {
            if (_selection.transform.GetChild(i).childCount > 0)
            {
                Destroy(_selection.transform.GetChild(i).GetChild(0).gameObject);
            }
        }

        for (int i = 0; i < board.Value.Length; i++)
        {
            var tile = (HexaTile)board.Value[i];

            var boardTile = Instantiate(GetTile(tile), _prefabPosition, Quaternion.identity);

            boardTile.transform.parent = _playerGrid.transform.GetChild(i);
            boardTile.transform.localPosition = _prefabPosition;

            boardTile.name = $"board_{i}";
        }
    }
}
