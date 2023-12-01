using Assets.Scripts;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class TabMenuController : MonoBehaviour
{
    private readonly VisualElement _root;
    private const string tabClassName = "VelTabs";

    private readonly FlowController _flowController;

    public TabMenuController(VisualElement root, FlowController flowController)
    {
        _root = root;
        _flowController = flowController;
    }

    private UQueryBuilder<Label> GetAllTabs()
    {
        return _root.Query<Label>(className: tabClassName);
    }

    public void RegisterTabCallbacks()
    {
        UQueryBuilder<Label> tabs = GetAllTabs();
        tabs.ForEach((Label tab) => {
            Debug.Log($"Register {tab.text} tab");

            tab.RegisterCallback<ClickEvent>(TabOnClick);
        });
    }

    private void TabOnClick(ClickEvent evt)
    {
        Label clickedTab = evt.currentTarget as Label;

        switch(clickedTab.name)
        {
            case "BtnHistory":
                _flowController.ChangeScreenState(ScreenState.HistoryScreen);
                break;
            case "BtnMain":
                _flowController.ChangeScreenState(ScreenState.MainScreen);
                break;
            case "BtnAccount":
                _flowController.ChangeScreenState(ScreenState.AccountScreen);
                break;
        }

        //if (!TabIsCurrentlySelected(clickedTab))
        //{
        //    GetAllTabs().Where(
        //        (tab) => tab != clickedTab && TabIsCurrentlySelected(tab)
        //    ).ForEach(UnselectTab);
        //    SelectTab(clickedTab);
        //}
    }

    //private static bool TabIsCurrentlySelected(Label tab)
    //{
    //    return tab.ClassListContains(currentlySelectedTabClassName);
    //}

    //private void SelectTab(Label tab)
    //{
    //    tab.AddToClassList(currentlySelectedTabClassName);
    //    VisualElement content = FindContent(tab);
    //    content.RemoveFromClassList(unselectedContentClassName);
    //}

    /* Method for the unselected tab: 
       -  Takes a tab as a parameter and removes the currentlySelectedTab class
       -  Then finds the tab content and adds the unselectedContent class */
    //private void UnselectTab(Label tab)
    //{
    //    tab.RemoveFromClassList(currentlySelectedTabClassName);
    //    VisualElement content = FindContent(tab);
    //    content.AddToClassList(unselectedContentClassName);
    //}

    // Method to generate the associated tab content name by for the given tab name
    //private static string GenerateContentName(Label tab) =>
    //    tab.name.Replace(tabNameSuffix, contentNameSuffix);

    //// Method that takes a tab as a parameter and returns the associated content element
    //private VisualElement FindContent(Label tab)
    //{
    //    return root.Q(GenerateContentName(tab));
    //}

    

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
