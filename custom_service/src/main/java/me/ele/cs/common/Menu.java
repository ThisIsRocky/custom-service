package me.ele.cs.common;

import java.util.ArrayList;
import java.util.List;

/**
 * 菜单表
 * 
 * @Create_by Ranger
 * @Create_Date 2015年5月21日上午1:41:22
 */
public class Menu extends BaseVo{

	private static final long serialVersionUID = -3754963959563250864L;

	// 菜单名称
	private String menuName;
	// url
	private String url;
    // 图表css class
    private String iconClass;
	// 父菜单id
	private Long parentId;
	// 菜单级别
	private int level;

    private int systemId;

	// 子菜单
	private List<Menu> childMenu = new ArrayList<Menu>();
	
	private Integer power;

	public Integer getPower() {
		return power;
	}

	public void setPower(Integer power) {
		this.power = power;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public List<Menu> getChildMenu() {
		return childMenu;
	}

	public void setChildMenu(List<Menu> childMenu) {
		this.childMenu = childMenu;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

    public String getIconClass() {
        return iconClass;
    }

    public void setIconClass(String iconClass) {
        this.iconClass = iconClass;
    }

    public int getSystemId() {
        return systemId;
    }

    public void setSystemId(int systemId) {
        this.systemId = systemId;
    }
}
