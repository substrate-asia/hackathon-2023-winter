using Assets.Scripts;
using Substrate.Hexalem;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

public class GameManager : MonoBehaviour
{
    private GameObject _selection;
    public GameObject EmptyTile;
    public GameObject HomeTile;
    public GameObject GrassTile;
    public GameObject WaterTile;
    public GameObject MountainTile;
    public GameObject ForestTile;
    public GameObject DesertTile;
    public GameObject CaveTile;

    private Vector3 _initialPosition;

    private TemplateContainer _mainInstance;
    public static HexaGame HexaGame;

    public GameManager()
    {
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("GameManager called");

        _selection = GameObject.FindGameObjectWithTag("SelectionTag");
        _initialPosition = _selection.transform.GetChild(0).transform.position;

        for (int i = 0; i < _selection.transform.childCount; i++)
        {
            Destroy(_selection.transform.GetChild(i).gameObject);
        }

        GameEventManager.startNewGameDelegate += StartNewGame;
    }

    private void GetRessourcesElement()
    {
        var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/MainScreenUI");
        _mainInstance = visualTreeAsset.Instantiate();
    }

    private void setRessourceWater(int value)
    {
        var waterLabel = _mainInstance.Q<Label>("LblResourceWater");
        waterLabel.text = value.ToString();
    }



    // Update is called once per frame
    void Update()
    {
        
    }

    void StartNewGame(string gameType)
    {
        GetRessourcesElement();

        if (gameType == "training")
        {
            Debug.Log("Start a new training game");

            HexaGame = Game.CreateGame(1, new List<HexaPlayer>() { new HexaPlayer(new byte[32]) }, GridSize.Medium);
            InitSelection(HexaGame.UnboundTiles);

            setRessourceWater(10);

        } else if(gameType == "local")
        {
            Debug.Log("Start a new local game (vs bots)");

        } else
        {
            Debug.Log("Start a new Pvp game");

        }

        //InitSelection();
        //Debug.Log($"Selection tile = {_selectionTile.name} / {_selectionTile.ToString()})");

        //var nbChildren = GameObject.FindGameObjectWithTag("SelectionTag").transform.childCount;

        //Debug.Log($"Selection has {nbChildren} elements");
        //_selections.Add(Instantiate(_selectionTile, new Vector3(8.0f, 0, 0), Quaternion.identity));
        //var newChild = Instantiate(_selectionTile, _selectionTile.transform.position, Quaternion.identity);
        //newChild.transform.parent = _selections.transform;

        //Debug.Log($"New child parent = {newChild.transform.parent}");

        //nbChildren = GameObject.FindGameObjectWithTag("SelectionTag").transform.childCount;
        //Debug.Log($"Selection has now {nbChildren} elements");

        //Debug.Log("Tiles have been generated");
    }

    public void InitSelection(List<HexaTile> tiles)
    {
        for(int i = 0; i < tiles.Count; i++)
        {
            var selectionTile = Instantiate(GetTile(tiles[i]), _initialPosition, Quaternion.identity);
            
            selectionTile.transform.localScale = new Vector3(GameConstant.TileRatio, GameConstant.TileRatio, GameConstant.TileRatio);

            selectionTile.transform.position = new Vector3((_initialPosition.x - 0.76f) * i, _initialPosition.y, (_initialPosition.z + 0.46f) * i);

            selectionTile.transform.parent = _selection.transform;
        }
    }

    public GameObject GetTile(HexaTile tile)
    {
        switch (tile.TileType)
        {
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

    public void LoadMap()
    {
    }
}
