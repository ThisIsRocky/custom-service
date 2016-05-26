package me.ele.cs.example.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.ele.cs.common.Menu;
import me.ele.cs.common.Pagination;
import me.ele.cs.example.model.Example;

@Controller
@RequestMapping("/index")
public class IndexController {

    
    @RequestMapping("/frame")
    public String frame(Model model) {
        List<Menu> menus = loadMenu();
        model.addAttribute("menus", menus);
        return "frame";
    }
    

    @RequestMapping("/example1")
    public String example1() {
        return "example/example1";
    }
    @RequestMapping("/toList")
    public String toList() {
        return "example/list";
    }
    @RequestMapping("/findList")
    @ResponseBody
    public Pagination<Example> findList(Example e) {
        Pagination<Example> page = e.getPagination();
        page.setTotalRows(55);
        List<Example> list = new ArrayList<Example>();
        for(int i = e.getPagination().getStart(); i < e.getPagination().getEnd(); i++) {
            Example ex = new Example();
            ex.setName("name"+i);
            ex.setAge(i);
            list.add(ex);
        }
        page.setData(list);
        return page;
    }
    @RequestMapping("/loadMenu")
    @ResponseBody
    public List<Menu> loadMenu() {
        List<Menu> list = new ArrayList<Menu>();
        
        Menu m = new Menu();
        m.setMenuName("测试菜单");
        m.setLevel(1);
        
        List<Menu> cm = new ArrayList<Menu>();
        Menu c1 = new Menu();
        c1.setMenuName("测试页面");
        c1.setUrl("/index/example1");
        c1.setLevel(2);
        cm.add(c1);
        
        Menu c2 = new Menu();
        c2.setMenuName("测试列表");
        c2.setUrl("/index/toList");
        c2.setLevel(2);
        cm.add(c2);
        
        for(int i = 0; i < 20; i++) {
            Menu c3 = new Menu();
            c3.setMenuName("测试列表"+i);
            c3.setUrl("/index/toList?asd="+i);
            c3.setLevel(2);
            cm.add(c3);
        }
        
        m.setChildMenu(cm);
        
        list.add(m);
        return list;
    }
}
