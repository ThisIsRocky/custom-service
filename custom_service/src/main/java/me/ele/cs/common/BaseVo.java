package me.ele.cs.common;

import java.io.Serializable;
import java.util.Date;

public class BaseVo<T> implements Serializable {
	private static final long serialVersionUID = 8573297497874330937L;

	/** 主键 */
	private Long id;

	/** 创建时间 */
	private Date createTime;

	/** 修改时间 */
	private Date modifyTime;

	/** 创建人 */
	private String createBy;

	/** 修改人 */
	private String modifyBy;

	/** 版本号 */
	private Long version;

	/**
	 * 分页PG
	 */
	private Pagination<T> pagination;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getModifyBy() {
		return modifyBy;
	}

	public void setModifyBy(String modifyBy) {
		this.modifyBy = modifyBy;
	}

	public Pagination<T> getPagination() {
		return pagination;
	}

	public void setPagination(Pagination<T> pagination) {
		this.pagination = pagination;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

}
