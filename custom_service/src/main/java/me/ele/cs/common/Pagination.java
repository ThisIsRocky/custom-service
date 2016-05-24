package me.ele.cs.common;

import java.util.Collections;
import java.util.List;

/**
 * @param <T>
 */
public class Pagination<T> {

    private List<T> data = Collections.emptyList();;

    public final static String DIRECTION_DESC = "DESC";
    public final static String DIRECTION_ASC = "ASC";
    private boolean success = true;

    /** 当前页，真实页数，取值：1、2、3.... */
    private int curPage = 1;

    /** 记录开始的rowNum，从零开始 */
    private int start;

    /** 每页显示数量limit */
    private int pageSize = 50;

    /** 排序asc,desc */
    private String sort;

    /** 排序字段 */
    private String sidx;

    private boolean needCount;

    private int totalRows;
    
    private boolean needPage = true;
    
    public Pagination() {
    }

    final public int getTotalRows() {
        return totalRows;
    }

    final public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    final public void calStart() {
        if (start >= totalRows) {
            start = ((int) ((totalRows - 1) / pageSize)) * pageSize;
        }
    }

    final public int getPgNumber() {
        return start / pageSize + 1;
    }

    final public int getEnd() {
        return this.start + this.pageSize;
    }

    final public int getStart() {
        return start;
    }

    final public void setStart(int start) {
        this.start = start;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        if (pageSize < 1)
            throw new IllegalArgumentException("每页显示数量小于1");
        this.pageSize = pageSize;	
        this.start = (curPage - 1) * pageSize;
    }

    final public boolean isNeedCount() {
        return needCount;
    }

    final public void setNeedCount(boolean needCount) {
        this.needCount = needCount;
    }

    final public String getSort() {
        return sort;
    }

    final public void setSort(String sort) {
        if (DIRECTION_ASC.equalsIgnoreCase(sort)) {
            this.sort = DIRECTION_ASC;
        } else if (DIRECTION_DESC.equalsIgnoreCase(sort)) {
            this.sort = DIRECTION_DESC;
        } else {
            this.sort = null;
        }
    }

    public String getSidx() {
        return sidx;
    }

    public void setSidx(String sidx) {
        if (sidx != null && sidx.matches("^\\w+$")) {
            this.sidx = sidx;
        }
    }

    public int getCurPage() {
        return curPage;
    }

    public void setCurPage(int curPage) {
        if (curPage < 1)
            throw new IllegalArgumentException("页数小于1");
        this.curPage = curPage;
        this.start = (curPage - 1) * pageSize;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    /** 获取到总页数 */
    public int getTotalPage() {
        if (totalRows <= pageSize) {
            return 1;
        } else {
            return ((int) (totalRows % pageSize)) != 0 ? ((int) (totalRows / pageSize)) + 1 : ((int) (totalRows / pageSize));
        }
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isNeedPage() {
        return needPage;
    }

    public void setNeedPage(boolean needPage) {
        this.needPage = needPage;
    }
}
