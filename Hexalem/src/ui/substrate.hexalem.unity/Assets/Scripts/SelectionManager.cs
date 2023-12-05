using Substrate.Hexalem;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using UnityEngine;

public class SelectionManager : MonoBehaviour
{
    public GameObject Selection;
    public GameObject EmptyTile;
    public GameObject HomeTile;
    public GameObject GrassTile;
    public GameObject WaterTile;
    public GameObject MountainTile;
    public GameObject ForestTile;
    public GameObject DesertTile;
    public GameObject CaveTile;

    private Vector3 _initialPosition;

    public void InitSelection(IEnumerable<HexaTile> tiles)
    {
        foreach(var tile in tiles)
        {
            var selectionTile = Instantiate(GetTile(tile), _initialPosition, Quaternion.identity);
            selectionTile.transform.parent = Selection.transform;
        }
    }

    public GameObject GetTile(HexaTile tile)
    {
        switch(tile.TileType)
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

    // Start is called before the first frame update
    void Start()
    {
        _initialPosition = Selection.transform.GetChild(0).transform.position;

        for (int i = 1; i < Selection.transform.childCount; i++)
        {
            Destroy(Selection.transform.GetChild(i).gameObject);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
