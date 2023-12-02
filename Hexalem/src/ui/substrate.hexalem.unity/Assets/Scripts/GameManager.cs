using Assets.Scripts;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    private bool _isGameStarted;
    //private GameObject _selectionTile;
    private GameObject _selections;

    // Tiles
    public GameObject EmptyTile;
    public GameObject WaterTile;

    public GameManager()
    {
        _isGameStarted = false;
    }

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("GameManager called");

        //EmptyTile = GameObject.FindGameObjectWithTag("TileEmpty");
        //WaterTile = (GameObject)Resources.Load("/Assets/Store/MiniToon Hexagonal Tiles Village/Prefabs/Base Tiles Prefabs/tile_water_plain", typeof(GameObject));
        //WaterTile = GameObject.FindGameObjectWithTag("TileIce");

        _selections = GameObject.FindGameObjectWithTag("SelectionTag");
        //var nbChildren = GameObject.FindGameObjectWithTag("SelectionTag").transform.childCount;
        //_selectionTile = _selections.transform.GetChild(0).gameObject;
        //_selectionTile = GameObject.Find("t0");

        GameEventManager.startNewGameDelegate += StartNewGame;
    }

    // Update is called once per frame
    void Update()
    {
        if(_isGameStarted)
        {
            //Debug.Log("GameManager update");

            
        }
        
    }

    void StartNewGame()
    {
        Debug.Log("A new game is started !!");
        InitSelection();
        //Debug.Log($"Selection tile = {_selectionTile.name} / {_selectionTile.ToString()})");

        var nbChildren = GameObject.FindGameObjectWithTag("SelectionTag").transform.childCount;

        Debug.Log($"Selection has {nbChildren} elements");
        //_selections.Add(Instantiate(_selectionTile, new Vector3(8.0f, 0, 0), Quaternion.identity));
        //var newChild = Instantiate(_selectionTile, _selectionTile.transform.position, Quaternion.identity);
        //newChild.transform.parent = _selections.transform;

        //Debug.Log($"New child parent = {newChild.transform.parent}");

        nbChildren = GameObject.FindGameObjectWithTag("SelectionTag").transform.childCount;
        Debug.Log($"Selection has now {nbChildren} elements");

        _isGameStarted = true;
        Debug.Log("Tiles have been generated");
    }

    public void InitSelection()
    {
        for(int i = 1; i < _selections.transform.childCount; i++)
        {
            Destroy(_selections.transform.GetChild(i).gameObject);
        }
        
        for (int i = 0; i < 8; i++)
        {
            var newTile = Instantiate(WaterTile, _selections.transform.GetChild(0).transform.position, Quaternion.identity);
            newTile.transform.parent = _selections.transform;
        }
    }

    public void LoadMap()
    {
        _isGameStarted = true;
    }
}
