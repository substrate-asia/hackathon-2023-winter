;
(function($) {
    const appName = "Jeditor";
    let cache, backup;
    const agent = []; //其他需要在dom加载之后运行的程序的队列
    const hash = function(n, pre) { return (!pre ? 'c' : pre) + Math.random().toString(32).substr(n != undefined ? n : 6) };

    const icons = {
        'hide': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAC1ElEQVRoge1ZW7HbQAw92+n/DQQzuIFgCGFQl0HKwBAMwWUQCIHgMlgIKQL1w3JnLWvfyXUyE83ox5G1R9LRrrwxRIRXlm97A6iVdwB7yzuArxBjzGiMIdbW/e3pAzDGjAB+eA2I6CkVwAHACIAcHQEcVnZ7Aw2AnyR41XZvsDXgiQjf78zXA4AjgIbVFcs6EdEt8P4VwKfz+DcRdd5F75CxI4AB26yFtK/NfBWFeLGeM5oKWmpTCz6bQlziM+uHx+wPBzaJ5y61BiKy7LMBcMGaNr+IaEgClZH1M4Ab9GyOAE4QW1wi/aTPLstH4iIavy0HlQX6nuCjATBACfwG4JwArsPcJ8cS8I6PYFChJr0o4IdQxplGVgn4mAOe7dz1R9+6PvCSMhZAGwDuC3gVQA5tuHqu3aQFkVLaS4znnh65uhQC0Arft4KkrKq5CsADvk9oxkEJuBE2XQxIwL+sxJqSNTsC5j09ePjUgE/xsZSqaDsT2bePAB/xdQC2M3cSeIX73aPAB3yOENmPcl44dJ01OeCZtraATr3wq4NIdLYEf3OeycNv0vxq7yau2Qj/VRVYZVGho753CxC1FSjuAeE4CbxCsWttDxTvQiXg2d46tkMh+HkXcqhQupXmgpf20b7zgJ9pK/icdRJn0qbBdjSI9hxSTuJIEJvRGal3NrO/HvNcREKnCPC8WUi86B5Ql8jvBH2E0JLx32eEZi22Y3l8GlUyfIHTC6ngAwFYAKdI1uVwGAw4Z6fJvjlwKNTJ0iu2vm/u8Nffo8Bn+D0rdFkoEx0z7gKebdoQr4XtiSmqZTz6ze2qYaeqpNzZGGMWMMs9Uexe6BO6/MXM/4E8V4+qRPib8vHdYJvFHLWY+6TseqYGvGhAmwF64my3tX20oZAx5oj54HGvDn8S0RirZu3tdJEo2exRMBPtpbH/yJIyv6cEd6FXkKf/lzIm7wD2lpcP4B8pIz3K225UogAAAABJRU5ErkJggg==',
        'show': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB+klEQVRoge2Y4XGEIBCFPzMpwA5yJViCJViCJVwJlnAlXAmWYAmWQDq4DsiPIwlhFgQxwzHjzvDnzn373vJAodFaU3O8lSaQG6eA0nEKKB2ngNJRvYD3I0CapmmB3owOuAAfzmOfgAJWYAEWrfUju7jWetcAWmAEZkDvHLPBaHfz2El8Ah4ZxN3xMJjJQo4kvgI3YAA6Ib8z/93Ms4cIiSU/8PSvVPAGXHbM5MXkSg1RwJAtwHRd8rgCxr2+FeqMngbNW7MRAu0E0M0p5ndh27nqe8HusKiSLBkUYEi43VhCVjGCfd5214qf0NNai9A4UbwEMAlFrxEWSN15ghYErkLOFBQA3AXl3m5ZnXcL3YHeeqYXsHUktmupuyhAKLASsZ05Xg8KFgitEfitYM37HwEZ5F3rBDvqmbGglbZEwHOPTyZvkmcXMDLPbtgcmSOJGHB+jCZvQG079Al5vZWnEvJcESuOomgSBvAnNyUvJ9cRr6s/D0CehRQvYKG6F7EAWNc26ulKiggbuMyLLCCink8JK2kSCtXxMbdBaKHc57RX8Nb0KcFSU2ht8AoHGge0ziOlUyB0qJ9C1tqwitTx7wblH+ojp9j29mteqyQK2TP+/2LLI2RE3jFix0Lm1WJjyGRFycvdQwSUjOrPA6eA0nEKKB2ngNJRvYAvX2AqsktMyCAAAAAASUVORK5CYII=',
        'remove': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAABiUlEQVRoge2ZwVHEMAxF/2c4cMyRIx2wHUAHpANSAh0wdEAJoQPoADrIdrBHjjnuTRyWBe2GzUqxiZNZvxlPHI9kS7GtaEYUEcyZs9QGhJIdSM15jElIXgEoARRGlRbAq4isghcXkaAGoAIgA1sVvH6g8WWA8dtWhtjAkDBKsgFwrYbeADRH1BYA7tT7UkQWg40I3AH9JWuHXq11U+7Aj7KIcCxdTScKkXxAN5oU2Gx9n0GroUaQfP9juMEmWmlaEXneGenb2om2naM6+x9Z5w4cOEKPqv+h+hcALgNt+ASwVu83qv+0J9s5QqZLHOvCWfCuNfsjlB1ITXZAQ7KKIePCm/MY8puDOZFRxpUjRQujY8po8h1ITXYgNdmB1GQHUpMdSE12QPGy9xwq4yNWNvotVxnm6pWxrhU9G41Fzkbnxuk5QLL+BzsGz22tkS3xW8i4J1ngeCHDS6fwYdIyhtEYpSRvuzXZZhHaxu+RDG/hKP65KjQDyqle3OXXoBLTFDi9MDo1Zu/AFwVKn18rx8HbAAAAAElFTkSuQmCC',
        'recover': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBQTFRFPz8/7+/vDw8Pj4+PEBAQ39/fHx8fv7+/BAQEb29vw8PD4ODgX19fMDAwAQEBUFBQLy8vn5+fz8/PLS0tGhoad3d3WVlZm5ubU1NThoaGZ2dnOzs7JiYmf39/AAAA////gUpl6gAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAABkklEQVR42rzW16KDIAwG4ES0raPL7kF4/7esgAdREvXqcNUKH/4BFxi+PR5CB7BH8Uv0xfWgzahrWbsWnKlv53WgodCaFQBPNs2b6G1znXAJtH6YJtKetgtA+yAW+HB6AYAv1QNbPizVUBRmAMb9QQHgONmQJdPIANSZBLrSBwJhOJEMIgJhuAx8b08gDM+0BIYRaEG9G52SA4Hs6g7c7a8PJvs32TH82HH3DtzcZZZX86DK3bBbB3R/Ze5rGdT7fpD24On44SiB48GFeAagjXKV7xQHQp+OQJilL0URqTi8O/sY/OXsS2kakxycgNFk4/BVlBP4uMw/FsRzVvzSgbDkl4uwOSBuqrD9DEjDLwJjrkTX5OAcgPRx8b+gWQcaD7rrjDbbZbDdkL0iwaC7W6GYBwW4Ox/dU6N0u1SiDKIhEHElARWFgChgVEoMxn3AzRKD6dmByzmAtD5IV0INQKUrCOla27gOTAtj30D9nN378JQsnfDaLSlqJa54sftSmO2XvzXY8LNfM+aV5y++5yfAADGD+b1Pp5YbAAAAAElFTkSuQmCC',
        'struct': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAACd0lEQVRoge1Z0XHDIAx96nWAbFCP4A2aETKKR8gI+euvR8gIzgYegWzgTqB+GLeAISCKaXpn3enO4ZB4gmcJOWBmSBRAC2ACwIV1AtBK8ZAGlSxEpAC8iYzS5c7MjcTgJWORE4DPDLuYfGrfIhGfgGVM9G3MzFTL1pScE3gq2QOICRG1RDQREZtazP/W70BK1nr2d2CrrAVgz0J/L3sAMdmzUET2LLQ8/7ssRETim+MmvqQNhD6xA+ymps/w0cNuZg5ZWDIDuDqLNxk+GmcTrlUCwPxSmq1gl7Ow9tU5vk6bBqCpo4wFh1zwhs/B8KekVJIudvktdRKodNkkAADHUtRJoNKxaAAe6oylwBtrjDlUSnX+4exQDf0oEgDmD1m1wS8a/dAlPdraGqVqDPxZuiMF3gX3xM9ZAXgcidLbL4O4pG5cKnUUMu8qmQEkZ72Qg+y8LKSKCu0uEuuOz7CBsDLqHRv0/CHltIw1pkQqeSu/z2iAkDqeE4tWaXO+gEqDO8dqaIioA/BuDHXMPKGQmA2+M856vDXH9dqdMfSuMVqTQtRJvp8jkUKwd9OnKmAX7D8eTSqedfD476ngX0xYd4BXKwCsmxRxY5ERTPQdcOZ7MfqONkidVKokAopmoQiVlB5bVdxw1cvINhE6qUfrBWwsrK+YC8Yid2YeUUH0Oo3Uhoju+PnSd3zBTItFrhEfPYCbfr7p37XFxHh4xczFRZpHljzn5WN5TCJpjOcJWPOqyeV1hczVOFhbXxYaUfHmKQB/gHNDZg7XgREVaoEA/AnrzvCnDuhJvTPhmbX/xu1Een4CcDE9W5gDL0qP+MWrpiqNaZVgvgA64dZ8r0BTQQAAAABJRU5ErkJggg==',
        'boxed': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAACDklEQVRoge2ZP27CMBSHv1f1ABwhB+nA2LEjY+ZKlThCx45sLKhwA66QoXM5Qhm7VIV2KAu4A0ZK08TEznOSgSdZyh/j977fz45wgjEG7QYkwATY2DYBkii5lAtPgQwwFS0D0l4BFNSuKrzY1FyJrnZsV0LUfgZ2vsrWcCrIFS2134GnLtaK9txeA2NgoLR+zroSqs69LXTt6LcAhrFdaawEMLTFduIKwFJlLsKgA1eWAPuKmyOfp0FkV0YV4+xxJDHAJzBrANLIFWBma3DV+OfkUNHpAKyAmxZcubW5XLWUA9SkbsMVZ14nQC7RTQ0lmrryAHw4ii7NUQvAcy56uVJjvG/XeN4AGq5oOhoMEOKKtntqAB7Kqq8fVYCYa6V1gIIrX7mxt6FqnwO4IkIYY16A19yllb2mHlEA2owLQNdxAeg6LgBdxwWg6+g9gIikIpJU3e8lgIgkIjIRkQ0wB95E5LGs73WrldUIEbnDvu8pRFbWv3cAHDf8+dgCC2NMVta5jwCT3PHCGLM494P85iBV/M+e5cbNFMdNKewHtjmYuYhs7AJKGiqpFiWL+hRbOM65qi1gRqArKDjA+Ze741PHBOXPP6EAvrWEUNdyxRcgNK+aEiEAGs5rzcV/6rgAtFyuDRCiWBFAQ+3GAJ4q7iqO1Z50jQA8XFFTOwpArLndCUDBlSnwY9tUQ+2y9gtGKyWwUyFCwQAAAABJRU5ErkJggg==',
        'exportData': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAACPUlEQVRoge1ZS1KEMBTsttzL0p3eQFy6khs4N3CO4A3EG3iEOYJH0BuMNxh3Lscqq3T3XBCGEAhEkgzMFF31qgKEvG7I572EIoJYILkCABFZRnMiIlEMwAMAUfYQy89JtC8DJJZyUMQUsBfMAsbGLGBszALGxixgbDQEkExIrkhuSYrFtiTTUCRIpg7+ViSbK7oRvyQA1qhimC7b9MRCuVY376m7cfS5BpB0xULPAK4cPtoXgIVDPVcsVJt9uELBcQdTgE7qC8C1iLDFEhFZ+3GuICJr1WbDF4Br1MXVPpwp4EwrZyFJDoXikGm3dI72WWgK5Et0cTkN4YBkroovfcLV7LVQxPKuuk4wZoPdiP9n9lW+twWQ2mYhAKmq4+Oj9l6ohawcZGcAXtvWCHXvFVUfdpl1ehFKQAZDBIBz7fk5muSzIJ5DdKG27gHg11LedbMQXSiYAIsI0waR35uAHhGDye9VgCbiR2vvx4d8F7co4bQUa8ENgG9lNxJpYaRSV1yQuwsp4pDJwMbt+BKaQ8PBC7AGc1qANmlYB/GUcVSDuCsfeNobCzc8tt083nWgPN+aArq4mF3oHdW2yr3aSPIJAcqc4NOjjRTAnXb9XntqBEwLuG0wjWmZNRpVIpYTIGnLJZYm39ogLkHyUv0Nn9PFDMCtKr+hSCmHYotix2PTeOITo/fE7zmqr5fH8nPwC9ksYHQEyH27diFcZhavXLl1FnIFyQ2Ai8ENFPgQkcuhL/t2IdeDCRu8D0r+ACQqHGBg8u9OAAAAAElFTkSuQmCC',
        'exportSetting': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFRQTFRFn5+fX19f39/fb29vLy8vHx8fj4+PZ2dn7+/vv7+/T09PBwcHd3d3Nzc3DAwMCAgIPz8/R0dHm5ubY2NjKSkpr6+vz8/PDw8Pf39/////AAAA////FncwpAAAABx0Uk5T////////////////////////////////////ABey4tcAAAGUSURBVHja7JXbkoMgDIbDSa21pz0kkL7/ey5QaNUCurc7+09nGiWfJAEC3MsSojIA5dcdc/crwDLbf+DvAYMgjiJ8BzCPiSEDg+Ys8w6Y56AeEiCer1ozeIkE0MyzmkPgKAGexe2k0bu9gD1VqgHWYgbQ2h1ATCgCIewdQCxBAHKaW0D065n7dfGqSQfiGH8Pf6THf71KuNwohEhtIBGEoGQYdi6My9Y64IX5goIUoewC0Mn4kfrC4fmMQOjAb9KDcwe/ncExQxUIUso5hy4pGKyagCRwCzHLJuC3W/gs+NOiIfo3ckhTeDdh4D6AEZF4Abakm3ZupCmYE41LoKIYx9z2a1MHUqKLR6RqSMf+AaTHaQUUSuRX1i+ZTo0L9DKk4o3W+dKAid1oMDBLOrSlcRVR31urjj4ITeNkR9IhvK8EfLfK5GbGR26VwK1CPfVJMjdj2a0iujJfTyfv1GfvYCjV7N5v2zvWtNXuVwdIkdi6H5ZHVMHOCyU3gfINNGvuuXPkNlMGzLqyZuOOK8yw1I8AAwAnCeFNb0DsmAAAAABJRU5ErkJggg==',
        'more': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFz8/PDw8PX19fZ2dn7+/vLy8vn5+fT09Pj4+PCAgIBwcHDAwMv7+/r6+vf39/AAAA////L6wz6AAAABF0Uk5T/////////////////////wAlrZliAAAAyUlEQVR42uzV2w7CIAwG4L/ATk6p7/+0WjIymbq26p1ruCJ8CRRocXUGPgIpEKtBIVWQOjZFlxbA5lgBqWcBNcBwdjTAkp/vQDZEA9xZcgP3ln6WpRB8YGQeXeC+7/waBB2EFcjrHjYpifEByMQg73sBl3c5r6BOneuP602Aev1PN4e2FIED/AHIGRUgZwMo9bYAqaoGQCIEyHoygLIuMkdqazt26/upjKYXQOkIT70DWg/Z9prde8DEPMFzcZhn/KRPH0CJmwADAOixiYoFwbqIAAAAAElFTkSuQmCC',
    }

    const config = {
        clsInput: hash(),
        clsTitle: hash(),
        clsBody: hash(),
        clsNote: hash(),
        clsFile: hash(),
        clsExpand: hash(), //展开列表
        clsShrink: hash(), //收缩列表
        clsArrayAdd: hash(), //array添加条目的操作
        clsBlock: hash(),
        clsAddContainer: hash(),
        clsRow: hash(),
        clsCol: hash(),
        clsLeft: hash(),
        clsRight: hash(),
        clsTime: hash(),
        clsShort: hash(),
        clsLong: hash(),
        clsHide: hash(), //编辑模式下隐藏项的样式
        clsImgButton: hash(),
        clsBool: hash(),
        row: {
            left: 3,
            right: 9,
            note: 0,
        },
        ui: {
            title: {
                rowAdd: '+ add row',
                branchAdd: 'new branch',
            },
            color: {
                basic: '#EEEEEE',
                active: '#9AB5C6',
                hide: '#E0E0E0',
            },
        },
        name: 'JSON Editor',
        mode: 'view', //编辑器的模式[view,edit]
        headerShow: true, //顶部显示的配置
        addShow: true, //显示array的添加按钮
        container: '', //容器id
        connector: hash(), //代替空格的字符串
        more: false, //是否对more进行显示
    }

    let lang = {}; //多语言解析
    let note = {}; //说明部分的添加
    let format = {}; //特殊的格式约定部分，目前处理枚举部分
    let hide = []; //需要隐藏的队列
    let lock = []; //需要锁定的队列

    const events = {
        onChange: null, //数据变化事件
        onReload: null, //数据重载事件
        onAdd: null, //数据条目添加事件
        onRemove: null, //数据条目移除事件
        onUpload: null, //数据上传事件
        onSwitch: null, //boolean数据转换事件
        onSelect: null, //枚举类型转换事件，用于处理数据重载
    }

    const self = {
        init: function(obj, cfg, skip) {
            //console.log(cfg);
            cache = obj;
            if (!skip) {
                backup = {
                    config: self.clone(cfg),
                    data: self.clone(obj),
                }
                self.setting(cfg);
            }

            const jID = self.hash();
            const cmap = self.getStyle(jID);
            const header = self.header();
            const dom = self.loop(obj, '', 0, config.mode == 'edit' ? true : cfg.disable);

            $(cfg.container).html(`${cmap}<div id="${jID}">${header}${dom}</div>`);
            self.auto(cfg, '#' + jID);

            return {
                getResult: self.result, //这个将去除，直接用事件来实现
                lang: lang,
                format: format,
                hide: hide,
            };
        },

        header: function() {
            if (config.headerShow == false) return '';
            const id = hash(),
                btnRecover = hash(),
                btnExport = hash(),
                btnMore = hash(),
                btnMode = hash(),
                btnConfigExport = hash();
            const imgMode = config.mode == 'view' ? icons.struct : icons.boxed;

            const moreID = hash(),
                keyID = hash(),
                enableID = hash();
            const addKey = hash(),
                addValue = hash(),
                btnAdd = hash();
            const display = config.more ? '' : 'display:none;';

            const basic = `<div class="${config.clsRow}" id="${id}">
			<div class="${config.clsCol}-3 ${config.clsLeft}">${config.name}</div>
			<div class="${config.clsCol}-8 ${config.clsRight}">
				<div class="${config.clsImgButton}" id="${btnRecover}" ><img src="${icons.recover}" title="recover data"></div>
				<div class="${config.clsImgButton}" id="${btnMore}" ><img src="${icons.more}" title="expand add menu"></div>
				<div class="${config.clsImgButton}" id="${btnExport}" style="margin-left:20px;"><img src="${icons.exportData}" title="export data"></div>
				<div class="${config.clsImgButton}" id="${btnConfigExport}"><img src="${icons.exportSetting}"  title="export setting"></div>
				
				<div class="${config.clsImgButton}" id="${btnMode}" style="margin-left:20px;"><img src="${imgMode}" title="change dataview mode"></div>
			</div></div><hr>`;


            const more = `<div class="${config.clsRow}" id="${moreID}" style="${display}margin-bottom:10px;">
				<div class="${config.clsAddContainer}">
				<div class="${config.clsCol}-8">key:&nbsp;<input type="text" id="${addKey}" style="width:30%">&nbsp;value:&nbsp;<input type="text" id="${addValue}" style="width:40%"></div>
				<div class="${config.clsCol}-3"><button id="${btnAdd}">${config.ui.title.branchAdd}</button></div>
				</div>
				</div>`;

            agent.push(function() {
                //1.绑定recover按钮
                $('#' + btnRecover).on('click', function() {
                    self.init(backup.data, backup.config);
                });

                $('#' + id).off('click');
                $('#' + moreID).off('click');

                //2.绑定export按钮
                $('#' + btnExport).on('click', function() {
                    self.derive(cache);
                });

                //3.绑定设置按钮
                $('#' + btnMore).on('click', function() {
                    const tg = '#' + moreID;
                    $(tg).is(":hidden") ? $(tg).slideDown() : $(tg).slideUp();
                });

                //4.添加键值按钮
                $("#" + btnAdd).on('click', function() {
                    const kk = $("#" + addKey).val();
                    const val = self.formatInput($("#" + addValue).val());
                    if (!kk) return $("#" + addKey).trigger('focus');
                    if (!val) return $("#" + addValue).trigger('focus');

                    config.more = true;
                    const path = $('.active').attr('path');
                    if (!path) {
                        cache[kk] = val;
                        self.init(cache, backup.config, true);
                    } else {
                        const chain = path.split('_');
                        if (chain.length == 1) {
                            cache[kk] = val;
                            self.init(cache, backup.config, true);
                            return true;
                        }

                        const tp = self.getType(chain);
                        if (tp == 'object') {
                            chain.push(kk);
                            self.save(val, chain, true);
                            self.reload(true);
                        }
                    }

                });

                $('#' + btnConfigExport).on('click', function() {
                    const dt = {
                        hide: hide,
                        note: note,
                        format: format,
                        lang: lang,
                        setting: config
                    }
                    self.derive(dt, 'setting.json');
                });

                //3.模式切换按钮
                $('#' + btnMode).on('click', function() {
                    config.mode = config.mode == 'view' ? 'edit' : 'view';
                    self.reload(true);
                });
            });

            return `${basic}${more}`;
        },
        formatInput: function(str) {
            if (typeof str == 'string') {
                try {
                    const obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return obj;
                    } else {
                        return str;
                    }
                } catch (e) {
                    return str;
                }
            }
            return str;
        },
        getType: function(chain) {
            let tmp = cache;
            for (let i = 0; i < chain.length; i++) {
                const kk = self.recoverSpace(chain[i], config.connector);
                tmp = tmp[kk];
            }
            return typeof tmp;
        },
        setting: function(cfg) {
            if (cfg.name) config.name = cfg.name;
            if (cfg.lang) lang = self.clone(cfg.lang);
            if (cfg.note) note = self.clone(cfg.note);
            if (cfg.format) format = self.clone(cfg.format);
            if (cfg.setting != undefined)
                for (let k in cfg.setting)
                    if (config[k] != undefined) config[k] = self.clone(cfg.setting[k]);
            for (var k in events) {
                if (cfg[k] != undefined && typeof cfg[k] === "function") events[k] = cfg[k];
            }
            if (cfg.hide)
                for (let i = 0, len = cfg.hide.length; i < len; i++) {
                    const hk = cfg.hide[i];
                    hide[self.getChainKey(Array.isArray(hk) ? hk : [hk])] = true;
                }
            if (cfg.lock)
                for (let i = 0, len = cfg.lock.length; i < len; i++) {
                    const kk = cfg.lock[i];
                    lock[self.getChainKey(Array.isArray(kk) ? kk : [kk])] = true;
                }
            config.container = cfg.container;
        },
        getChainKey: function(chain, k) {
            const pre = 'cc_';
            if (k != undefined) {
                let nc = self.clone(chain);
                nc.push(k);
                return pre + JSON.stringify(nc);
            }
            return pre + JSON.stringify(chain);
        },

        auto: function(cfg, sel) {
            //1.输入框部分，blur就进行数据保存
            $("." + config.clsInput).off('blur').on('blur', function() {
                const chain = $(this).attr('id').split('_');
                const val = $(this).val();
                self.save(val, chain);
            });

            //2.展开和收起子容器的操作
            $("." + config.clsShrink).off('click').on('click', function() {
                event.stopPropagation(); //防止冒泡，不然会触发row的click
                const tg = '#con_' + $(this).attr('target');
                if ($(tg).is(":hidden")) {
                    $(this).html('-');
                    $(tg).slideDown();
                } else {
                    $(this).html('+');
                    $(tg).slideUp();
                }
            });

            //3.添加数组条目的操作
            $("." + config.clsArrayAdd).off('click').on('click', function() {
                //$(this).parent().parent().parent().trigger('click');
                const chain = $(this).attr('id').split('_');
                const list = self.getArray(chain);
                list.push(list.length == 0 ? 'new row' : self.clone(list[0]));
                self.save(list, chain);
                self.init(cache, cfg, true);
            });


            //4.title选中整行的操作
            $("." + config.clsRow).off('click').on('click', function() {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(sel).find('.active').removeClass('active')
                    $(this).addClass('active');

                    const chain = $(this).attr('path').split('_');
                    if (chain.length == 1 || self.getType(chain) == 'object') {
                        $("." + config.clsAddContainer).show();
                    } else {
                        $("." + config.clsAddContainer).hide();
                    }
                }
            });

            //5.agent队列里的自动运行都处理好
            if (agent.length != 0) {
                for (let i = 0, len = agent.length; i < len; i++) agent[i]();
            }
        },
        loop: function(obj, dep, skip, disable, chain) {
            if (!dep) dep = 0;
            let str = '';
            const isShow = self.isShow,
                domRow = self.domRow,
                getKey = self.getChainKey,
                getID = self.getIDbyChain;
            const left = config.row.left;
            right = config.row.right, ncol = config.row.note;
            const clsTitle = config.clsTitle,
                clsBody = config.clsBody,
                clsNote = config.clsNote,
                col = config.clsCol,
                clsRight = config.clsRight;
            const clsHide = config.clsHide,
                clsRow = config.clsRow;
            for (const k in obj) {
                if (dep == 0) chain = [];
                let bks = self.getBlocks(dep);
                const target = getID(k, chain);

                const hk = getKey(chain, k);
                if (config.mode == 'view' && hide[hk]) continue; //非编辑模式下不显示隐藏的数据

                const id = self.getIDbyChain(k, chain);
                const title = config.mode == 'edit' ? k : (!lang[k] ? k : lang[k]);
                const txt = !note[k] ? '<p>&nbsp;</p>' : '<p>' + note[k] + '</p>';

                const nchain = self.clone(chain);
                nchain.push(k);
                const dis = disable || lock[self.getChainKey(nchain)];

                if (isShow(obj[k])) {
                    //1.平直状态，不需要再遍历
                    str += domRow(k, obj[k], dep, chain, dis);
                } else {
                    //2.子容器状态，还需要再遍历出数据
                    const ccTitle = col + '-' + left + ' ' + clsTitle;
                    const ccBody = col + '-' + right + ' ' + clsBody + ' ' + clsRight;
                    const ccNote = col + '-' + ncol + ' ' + clsNote;
                    const ccHide = hide[hk] ? clsHide : '';

                    let nc = self.clone(chain);
                    nc.push(k);
                    if (Array.isArray(obj[k])) {
                        if (!skip) {
                            const ctxTitle = bks + title;
                            str += `<div class="${clsRow} depth_${dep} ${ccHide}" path="${id}"><div class="${ccTitle}">${ctxTitle}<button class="${config.clsShrink}" target="${target}">-</button></div>`;
                            if (dis) {
                                str += `<div class="${ccBody}">&nbsp;</div>`;
                            } else {
                                str += `<div class="${ccBody}"><button id="${target}" class="${config.clsArrayAdd}">${config.ui.title.rowAdd}</button></div>`;
                            }

                            if (config.mode == 'edit') {
                                const btns = self.operationButtons(k, chain);
                                str += `<div class="${ccNote}">${btns}</div></div>`;
                            } else {
                                str += `<div class="${ccNote}">${txt}</div></div>`;
                            }
                        }
                        const rst = self.loop(obj[k], dep + 1, false, dis, nc);
                        str += `<div id="con_${target}" class="${ccHide}">${rst}</div>`;
                    } else {
                        if (!skip) {
                            const ctxTitle = bks + title;
                            str += `<div class="${clsRow} depth_${dep} ${ccHide}" path="${id}"><div class="${ccTitle}">${ctxTitle}<button class="${config.clsShrink}" target="${target}">-</button></div>`;
                            str += `<div class="${ccBody}">&nbsp;</div>`;

                            if (config.mode == 'edit') {
                                const btns = self.operationButtons(k, chain);
                                str += `<div class="${ccNote}">${btns}</div></div>`;
                            } else {
                                str += `<div class="${ccNote}">${txt}</div></div>`;
                            }
                        }
                        str += '<div id="con_' + target + '" class="' + ccHide + '">';
                        str += self.loop(obj[k], dep + 1, false, dis, nc);
                        str += '</div>';
                    }
                }
            }
            return str;
        },
        domRow: function(k, v, dep, chain, disable) {
            const bks = self.getBlocks(dep);
            const title = config.mode == 'edit' ? k : (!lang[k] ? k : lang[k]);
            const col = config.clsCol;
            const ccTitle = col + '-' + config.row.left + ' ' + config.clsTitle;
            const ccBody = col + '-' + config.row.right + ' ' + config.clsBody;
            const ccNote = col + '-' + ncol + ' ' + config.clsNote;
            const txt = !note[k] ? '<p>&nbsp;</p>' : '<p>' + note[k] + '</p>';
            const ctxTitle = bks + title;
            const id = self.getIDbyChain(k, chain);

            const hkey = self.getChainKey(chain, k);
            const ccHide = hide[hkey] ? config.clsHide : '';

            let ctx = '';
            if (config.mode == 'edit') {
                ctx = self.getInput(id, v, disable);
            } else {
                if (format[k]) {
                    const type = format[k].type;
                    switch (type) {
                        case 'enum':
                            ctx = self.getEnum(id, v, disable, format[k].data);
                            break;
                        case 'image':
                            ctx = self.getImage(id, v, disable, format[k].default);
                            break;
                        case 'time':
                            if (moment(v).isValid()) {
                                ctx = self.getTime(id, v, disable, !format[k].default ? {} : format[k].default);
                            } else {
                                ctx = self.getInput(id, v, disable);
                            }
                            break;
                        case 'bool':
                            ctx = self.getBool(id, v, disable);
                            break;
                        case 'file':
                            ctx = self.getFile(id, v, disable, !format[k].default ? {} : format[k].default);
                            break;
                        case 'list':
                            ctx = self.getInput(id, v, disable);
                            break;
                        case 'email':
                            ctx = self.getEmail(id, v, disable, !format[k].default ? {} : format[k].default);
                            break;
                        case 'mobile':
                            ctx = self.getMobile(id, v, disable, !format[k].default ? {} : format[k].default);
                            break;
                        default:
                            ctx = self.getInput(id, v, disable);
                            break;
                    }
                } else {
                    ctx = self.getInput(id, v, disable);
                }
            }

            let more = '';
            if (config.mode == 'edit') {
                const btns = self.operationButtons(k, chain);
                more = `<div class="${ccNote}">${btns}</div>`;
            } else {
                more = `<div class="${ccNote}">${txt}</div>`;
            }

            return `<div class="${config.clsRow} depth_${dep} ${ccHide}" path="${id}"><div class="${ccTitle}">${ctxTitle}</div><div class="${ccBody}">${ctx}</div>${more}</div>`;
        },

        operationButtons: function(k, chain) {
            const idRemove = hash(),
                idHide = hash(),
                idShow = hash();
            const hkey = self.getChainKey(chain, k);
            agent.push(function() {
                $("#" + idRemove).off('click').on('click', function() {
                    if (chain.length == 0) {
                        delete cache[k];
                    } else {
                        let tmp = cache;
                        for (let i = 0; i < chain.length; i++) tmp = tmp[chain[i]];
                        //1.check Array type
                        if (Array.isArray(tmp)) {
                            let narr = [];
                            for (let j = 0; j < tmp.length; j++) {
                                if (j != parseInt(k)) narr.push(tmp[j]);
                            }

                            let ntmp = cache;
                            for (let ic = 0; ic < chain.length - 1; ic++) ntmp = ntmp[chain[ic]];
                            ntmp[chain[chain.length - 1]] = narr;

                        } else {
                            delete tmp[k];
                        }
                    }
                    self.reload(true);
                });

                $("#" + idHide).off('click').on('click', function() {
                    hide[hkey] = true;
                    self.reload(true);
                });

                $("#" + idShow).off('click').on('click', function() {
                    delete hide[hkey];
                    self.reload(true);
                });
            });
            return hide[hkey] ? `<div id="${idRemove}" class="${config.clsImgButton}"><img src="${icons.remove}"></div><div class="${config.clsImgButton}" id="${idShow}"><img src="${icons.hide}"></div>` : `<div id="${idRemove}" class="${config.clsImgButton}"><img src="${icons.remove}"></div><div id="${idHide}" class="${config.clsImgButton}"><img src="${icons.show}"></div>`;
        },
        isShow: function(o) {
            if (Array.isArray(o)) return false;
            if (typeof o == 'object') return false;
            return true;
        },


        getBlocks: function(n) {
            let str = '';
            const bk = `<div class="${config.clsBlock}"></div>`;
            for (let i = 0; i < n; i++) str += bk;
            return str;
        },
        getIDbyChain: function(k, chain) {
            let str = '';
            for (let i = 0; i < chain.length; i++) str += chain[i] + '_';
            return self.removeSpace(str + k, config.connector);
        },

        getTime: function(id, v, disable, cfg) {
            const idYear = hash(),
                idMonth = hash(),
                idDay = hash(),
                idHour = hash(),
                idMin = hash(),
                idSec = hash(),
                idZone = hash();

            let mt;
            if (cfg.format && cfg.format === 'stamp') {
                mt = moment(v * 1000);
            } else {
                mt = moment(v).utcOffset(v);
            }

            const cy = mt.format('YYYY'),
                cm = mt.format('M'),
                cd = mt.format('D');
            const ch = mt.format('H'),
                cn = mt.format('m'),
                cs = mt.format('s');
            const cz = self.getTimeZone(mt);

            const tzSelect = self.domTimeZoneSelector(cz);
            const fmt = cfg.format ? { type: cfg.format } : self.checkTimeFormat(mt); //记录原来的时间保存格式
            const dis = disable ? 'disabled="disabled"' : '';

            //console.log(fmt)
            //console.log('time string:'+v+',format:'+fmt+',key:'+id);

            const zone = cfg.timeZone ? `<td><select id="${idZone}" ${dis} style="margin-right:10px;">${tzSelect}</select></td>` : `<input type="hidden" id="${idZone}" value="${cz}">`;

            const saveTime = function() {
                const year = parseInt($("#" + idYear).val());
                let month = parseInt($("#" + idMonth).val());
                let day = parseInt($("#" + idDay).val());
                let hour = parseInt($("#" + idHour).val());
                let minute = parseInt($("#" + idMin).val());
                let second = parseInt($("#" + idSec).val());
                const zz = $("#" + idZone).val();

                //处理year的超限问题
                if (isNaN(year)) return focus('#' + idYear, 2020);
                if (year > 2099) return focus('#' + idYear, 2020);
                if (year < 1900) return focus('#' + idYear, 1900);

                //处理month的超限问题

                if (isNaN(month)) return focus('#' + idMonth, 1);
                if (month > 12) return focus('#' + idMonth, 12);
                if (month < 1) return focus('#' + idMonth, 1);

                //处理day的超限问题
                const max = moment(year + "-" + month, "YYYY-MM").daysInMonth();
                if (isNaN(day)) return focus('#' + idDay, 1);
                if (day > max) return focus('#' + idDay, max);
                if (day < 1) return focus('#' + idDay, 1);

                //处理hour的超限问题
                if (isNaN(hour)) return focus('#' + idHour, 23);
                if (hour > 23) return focus('#' + idHour, 23);
                if (hour < 0) return focus('#' + idHour, 0);

                //处理minute的超限问题
                if (isNaN(minute)) return focus('#' + idMin, 59);
                if (minute > 59) return focus('#' + idMin, 59);
                if (minute < 0) return focus('#' + idMin, 0);

                //处理second的超限问题
                if (isNaN(second)) return focus('#' + idSec, 59);
                if (second > 59) return focus('#' + idSec, 59);
                if (second < 0) return focus('#' + idSec, 0);

                //拼接成需要的字符串
                //const value=year+'-'+month+'-'+day+'T'+hour+':'+minister+':'+second+(zz=='+0:00'?'Z':zz);
                const obj = { year: year, month: month, day: day, hour: hour, minute: minute, second: second, timezone: zz };
                const value = self.saveTimeByFormat(obj, fmt);

                const chain = $('#' + id).attr('id').split('_');
                self.save(value, chain);
            };


            const focus = function(sel, val) {
                $(sel).val(val).css({ 'background': '#FEEEEE' });
            }

            agent.push(function() {
                $("#" + id).find('input').off('blur').on('blur', saveTime).on('input', function() {
                    $(this).css({ 'background': '#FFFFFF' });
                });
                $("#" + id).find('select').off('change').on('change', saveTime);
            });

            return `<table class="${config.clsTime}" id="${id}"><tr>
				${zone}
				<td><input class="${config.clsLong}" id="${idYear}" value="${cy}"></td>
				<td>-</td>
				<td><input class="${config.clsShort}" id="${idMonth}" value="${cm}"></td>
				<td>-</td>
				<td><input class="${config.clsShort}" id="${idDay}" value="${cd}"></td>
				<td>&nbsp;</td>
				<td><input class="${config.clsShort}" id="${idHour}" value="${ch}"></td>
				<td>:</td>
				<td><input class="${config.clsShort}" id="${idMin}" value="${cn}"></td>
				<td>:</td>
				<td><input class="${config.clsShort}" id="${idSec}" value="${cs}"></td>
			</tr></table>`;
        },
        saveTimeByFormat: function(obj, format) {
            const dt = new Date();
            const zz = dt.getTimezoneOffset(); //修正时差的值

            const timezone = obj.timezone;
            const year = obj.year;
            let month = obj.month - 1;
            let day = obj.day;
            let hour = obj.hour;
            let minute = obj.minute;
            let second = obj.second;
            let ms = obj.ms != undefined ? obj.ms : 0;

            const stamp = Date.UTC(year, month, day, hour, minute, second, ms) + zz * 1000 * 60;
            const mt = moment(stamp);
            switch (format.type) {
                case 'ISO':
                    if (format.pattern) {
                        return moment(stamp).format(format.pattern);
                    } else {
                        return moment(stamp).format('YYYY-MM-DDTHH:mm:ssZ');
                    }
                    break;
                case 'stamp':
                    return Math.floor(stamp * 0.001);
                    break;
                case 'microstamp':
                    return stamp;
                    break;
                default:
                    return stamp;
                    break;
            }
        },
        checkTimeFormat: function(mt) {
            /*const vers={
            	'ISO':/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            	'ExtendISO':/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            	'RFC2822':/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
            	'Stamp':/\d/,
            }*/
            const cfg = mt._pf;
            if (cfg.iso === true) {
                return { type: 'ISO', pattern: mt._f };
            } else if (cfg.rfc2822 === true) {
                console.log(mt)
                return { type: 'RFC2822', pattern: mt._f };
            }
        },
        getTimeZone: function(mt) {
            if (mt._tzm != undefined) {
                if (mt._tzm === 0) {
                    return 'Z';
                } else {
                    const tz = mt._tzm / 60;
                    const pre = mt._tzm > 0 ? '+' : '-';
                    return pre + (tz < 10 ? '0' : '') + tz + ':00';
                }
            } else {
                return mt.format('Z');
            }
        },
        domTimeZoneSelector: function(zone) {
            let za = '',
                zb = '';
            for (let i = 1; i < 13; i++) {
                const ztag = i < 10 ? '0' + i : i;
                const act = ('-' + ztag + ':00') == zone ? 'selected="selected"' : '';
                zb += `<option value="-${ztag}:00"  ${act}>-${i}</option>`;
            }
            const act = ('0:00' == zone || 'Z' == zone) ? 'selected="selected"' : '';
            const zc = `<option value="+0:00" ${act}>0</option>`;
            for (let i = 1; i < 13; i++) {
                const ztag = i < 10 ? '0' + i : i;
                const act = ('+' + ztag + ':00') == zone ? 'selected="selected"' : '';
                za += `<option value="+${ztag}:00" ${act}>+${i}</option>`;
            }

            return za + zc + zb;
        },
        clearActive: function() {
            console.log('clear active:' + config.container);
            //$('#'+config.container).find('.active').removeClass('active');
        },

        getBool: function(id, v, disable, cfg) {
            const checked = v ? '"checked"' : '';
            agent.push(function() {
                if (v == true) {
                    $("#" + id).trigger('click');
                }

                $("#" + id).off('blur').on('click', function() {
                    const val = $(this).is(':checked');
                    const chain = $(this).attr('id').split('_');

                    if (val) $(this).attr("checked", "checked");
                    else $(this).removeAttr('checked');
                    const dd = !val;

                    console.log('clicked,value:' + val + ',changed:' + dd);

                    $(this).val(!dd);
                    self.save(dd, chain);
                });
            });
            return `<div class="${config.clsBool}">
				<input type="checkbox" id="${id}" value="${v}" ${checked}/>
				<label for="${id}"></label>
			</div>`;
        },

        getImage: function(id, v, disable, cfg) {
            const cls = config.clsInput,
                dis = disable ? 'disabled="disabled"' : '';
            const info_con = 'file_' + id;
            const size_con = 'size_' + id;
            const preview_con = 'pv_' + id;

            const form = '<input class="' + cls + ' form-control ' + config.clsFile + '" id="' + id + '" type="file" value="' + v + '" ' + dis + ' accept="image/png,image/jpeg,image/jpg,image/gif"/>';
            const thumb = v == '' ? '&nbsp;' : '<img width="48" height="30" style="cursor: pointer;"  src="' + v + '" id="' + preview_con + '">';
            const size = ((v == '' || cfg.skipSize) ? '&nbsp;' : self.formatSize(v.length));

            const max = !cfg || !cfg.maxSize ? 1024 * 1024 : cfg.maxSize;

            agent.push(function() {
                $("#" + id).off('blur').off('change').on('change', function(res) {
                    const chain = $(this).attr('id').split('_');
                    const fa = res.target.files[0];
                    if (fa.size > max) return $("#" + info_con).html('File max size:' + max);
                    self.getBase64FromFile(fa, function(base64) {

                        const img = '<img width="48" height="30" src="' + base64 + '">';
                        $("#" + info_con).html(img);
                        if (!cfg.skipSize) $("#" + size_con).html(self.formatSize(fa.size));
                        const result = { chain: chain, value: fa };

                        if (events.onUpload != null) events.onUpload(result, function(val) {
                            $("#" + info_con).html(`<img width="48" height="30" src="${val}">`);

                            self.save(val, chain);
                        });

                    });
                });

                $("#" + preview_con).off('click').on('click', function() {
                    const val = $(this).attr('src');
                    self.preview(val);
                });
            });
            return `<table><tr><td>${form}</td><td id="${info_con}">${thumb}</td><td id="${size_con}">${size}</td></tr></table>`;
        },
        preview: function(target) {
            const img = new Image();
            img.src = target;
            img.onload = function() {
                const iw = img.width,
                    ih = img.height;
                const h = $(window).height(),
                    w = $(window).width();
                const size = self.calcPreview(iw, ih, w, h);
                const dom = `<div id="preview" style="position:fixed;top:${size.top}px;left:${size.left}px;z-index: 1010;"><h3 style="position:relative;left:${size.width-180}px;top:50px;color:#F77113">点击空白处关闭</h3><img src="${target}" width="${size.width}" height="${size.height}" ></div>`;
                $('body').append(dom);

                self.mask(function() {
                    $("#preview").remove();
                });
            }
        },
        calcPreview: function(iw, ih, w, h) {
            const rate = 0.6;
            const result = { top: 0, left: 0, width: 0, height: 0 }
            let sw, sh;
            if (iw < w * rate) {
                result.width = iw;
                result.height = ih;
            } else {
                result.width = w * rate;
                result.height = ih * w * rate / iw;
            }
            result.left = (w - result.width) * 0.5;
            result.top = (h - result.height) * 0.5;
            return result;
        },
        mask: function(onClick) {
            const height = $(window).height();
            const dom = `<div id="mask" style="display:none;position:fixed;top:0;left:0;width:100%;height:${height}px;background-color:black;z-index: 1001;-moz-opacity: 0.3;opacity: .30;filter: alpha(opacity=30);"></div>`;

            $('body').append(dom).find('#mask').show().on('click', function() {
                $(this).remove();
                onClick && onClick();
            });
        },
        getFile: function(id, v, disable, cfg) {
            const cls = config.clsInput,
                dis = disable ? 'disabled="disabled"' : '';
            const info_con = hash() + '_' + id;
            const form = '<input class="' + cls + ' form-control ' + config.clsFile + '" id="' + id + '" type="file" value="' + v + '" ' + dis + ' accept="*/*"/>';
            const size = v == '' ? '&nbsp;' : self.formatSize(v.length);
            agent.push(function() {
                $("#" + id).off('blur').off('change').on('change', function(res) {
                    const chain = $(this).attr('id').split('_');
                    const fa = res.target.files[0];
                    if (fa.size > cfg.maxSize) return $("#" + info_con).html('max size:' + self.formatSize(cfg.max));
                    const result = { chain: chain, value: fa };
                    $("#" + info_con).html('uploading...');
                    if (events.onUpload != null) events.onUpload(result, function(val) {
                        $("#" + info_con).html('uploaded');
                        setTimeout(function() {
                            self.save(val, chain);
                        }, 200);
                    });
                });
            });
            return `<table><tr><td>${form}</td><td id="${info_con}"></td></tr></table>`;
        },
        getEmail: function(id, v, disable, cfg) {
            const dis = disable ? 'disabled="disabled"' : '';
            agent.push(function() {
                $("#" + id).off('blur').on('blur', function(res) {
                    $(this).css({ 'background': '#FFFFFF' });
                    const chain = $(this).attr('id').split('_');
                    const val = $(this).val();
                    const rule = !cfg.rule ? /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ : cfg.rule;
                    if (rule.test(val)) {
                        self.save(val, chain);
                    } else {
                        $(this).css({ 'background': '#FEEEEE' });
                    }
                });
            });
            return `<input class="${config.clsInput} form-control" id="${id}" type="text" value="${v}" ${dis}/>`;
        },
        getMobile: function(id, v, disable, cfg) {
            const dis = disable ? 'disabled="disabled"' : '';
            agent.push(function() {
                $("#" + id).off('blur').on('blur', function(res) {
                    $(this).css({ 'background': '#FFFFFF' });
                    const chain = $(this).attr('id').split('_');
                    const val = $(this).val();
                    const rule = !cfg.rule ? /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/ : cfg.rule;
                    if (rule.test(val)) {
                        self.save(val, chain);
                    } else {
                        $(this).css({ 'background': '#FEEEEE' });
                    }
                });
            });
            return `<input class="${config.clsInput} form-control" id="${id}" type="text" value="${v}" ${dis}/>`;
        },
        formatSize: function(size) {
            const k = 1024,
                m = 1048576;
            let txt = '';
            if (size > m) {
                txt = (size / m).toFixed(2) + 'm';
            } else if (size > k) {
                txt = (size / k).toFixed(2) + 'k';
            } else {
                txt = size
            }
            return txt;
        },
        getBase64FromFile: function(fa, ck) {
            const reader = new FileReader();
            reader.onload = function(res) {
                ck && ck(res.target.result)
            }
            reader.readAsDataURL(fa);
        },

        getEnum: function(id, v, disable, list) {
            let dom = '';
            const dis = disable ? 'disabled="disabled"' : '';
            for (let i = 0, len = list.length; i < len; i++) {
                const row = list[i],
                    set = row.value == v ? 'selected="selected"' : '';
                dom += `<option value="${row.value}" ${set}>${row.title}</option>`;
            }

            agent.push(function() {
                $("#" + id).off('change').on('change', function() {
                    const chain = $(this).attr('id').split('_'),
                        val = $(this).val();
                    self.save(val, chain);
                    const result = { value: val, chain: chain }
                    if (events.onSelect) events.onSelect(result);
                });
            });
            return `<select class="${config.clsInput}" id="${id}" ${dis}>${dom}</select>`;
        },
        getInput: function(id, v, disable, cfg) {
            const type = typeof(v);
            switch (type) {
                case 'string':
                    return self.textInput(id, v, disable, cfg);
                    break;

                case 'number':
                    return self.numInput(id, v, disable, cfg);
                    break;

                default:
                    return self.textInput(id, v, disable, cfg);
                    break;
            }
        },
        numInput: function(id, v, disable, cfg) {
            const dis = disable ? 'disabled="disabled"' : '';
            return `<input class="${config.clsInput} form-control" id="${id}" type="number" value="${v}" ${dis}/>`;
        },
        textInput: function(id, v, disable, cfg) {
            const dis = disable ? 'disabled="disabled"' : '';
            return `<input class="${config.clsInput} form-control" id="${id}" type="text" value="${v}" ${dis}/>`;
        },

        getArray: function(chain) {
            let tmp = cache;
            for (let i = 0; i < chain.length; i++) {
                const kk = self.recoverSpace(chain[i], config.connector);
                tmp = tmp[kk];
            }
            return self.clone(tmp);
        },
        clone: function(obj) {
            if (typeof(obj) == 'string') {
                return obj;
            } else if (Array.isArray(obj)) {
                return $.extend(true, [], obj);
            } else if ($.isPlainObject(obj)) {
                return $.extend(true, {}, obj);
            } else {
                return obj;
            }
        },
        result: function() {
            return cache;
        },
        reload: function(skip, ck) {
            self.init(cache, backup.config, skip);
            if (events.onChange != null) events.onChange(cache);
            ck && ck();
        },
        //force:强制写，如果不存在的话
        save: function(val, chain, force) {
            let tmp = cache;
            const recover = self.recoverSpace,
                cnt = config.connector;
            for (let i = 0; i < chain.length - 1; i++) {
                const kk = recover(chain[i], cnt);
                if (!tmp[kk] && !force) return false;
                tmp = tmp[kk];
            }
            tmp[recover(chain[chain.length - 1], cnt)] = val;
            if (events.onChange != null) events.onChange(cache);
            return true;
        },
        derive: function(data, filename) {
            if (!data) return false;
            if (!filename) filename = 'data.json';
            const raw = JSON.stringify(data, undefined, 4);
            const blob = new Blob([raw], { type: 'text/json' }),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a');
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },
        getStyle: function(id) {
            const height = 40, //row height
                sh = 26, //
                ih = 28; //input height
            return `<style type="text/css">
			#${id}{font-size: 16px;width: 100%;padding: 0px 0px 0px 0px;margin: 0px 0px 0px 0px;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
			#${id} hr{margin:5px 0px 5px 0px;height:1px;border:none;background:${config.ui.color.active};}
			#${id} input{width:90%;height: ${ih}px;line-height:${ih}px;padding:0px 0px 0px 10px;margin:6px 0px 0px 0px;border:1px solid ${config.ui.color.basic};}
			#${id} input[type=file]{height:${ih}px;font-size:16px;padding:0px 0px 0px 10px;border:none;}
			#${id} select{width: 90%;height:${ih}px;font-size:16px;line-height:${ih}px;border-color:#CED4DA;padding:1px 0px 1px 10px;margin:0px 0px 0px 0px;}
			#${id} .${config.clsLeft}{text-align:left}
			#${id} .${config.clsRight}{text-align:right}
			#${id} .${config.clsBlock}{width:${height}px;float:left;height: ${height}px;}
			#${id} .${config.clsArrayAdd}{height:${sh}px;line-height:${sh}px;vertical-align:middle;padding:0px 8px 0px 8px;background: ${config.ui.color.basic};border: none;}
			#${id} .active{background:${config.ui.color.active}}
			#${id} .${config.clsRow}{padding:0px 0px 0px 0px;height:${height}px;line-height:${height}px;vertical-align:middle;width: 100%;margin:0px 0px 0px 0px;overflow:hidden;}
			#${id} .${config.clsCol}-1{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:8.33%;}
			#${id} .${config.clsCol}-2{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:16.67%}
			#${id} .${config.clsCol}-3{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:25%;}
			#${id} .${config.clsCol}-4{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:33.33%;}
			#${id} .${config.clsCol}-5{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:41.67%;}
			#${id} .${config.clsCol}-6{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:50%;}
			#${id} .${config.clsCol}-7{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:58.33%;}
			#${id} .${config.clsCol}-8{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 5px;float:left;width:66.67%;}
			#${id} .${config.clsCol}-9{overflow: hidden;vertical-align: middle;margin:0 auto;padding:0px 0px 0px 0px;float:left;width:75%;}
			#${id} .${config.clsCol}-10{overflow: hidden;vertical-align: middle;margin:0 auto;float:left;width:83.33%;}
			#${id} .${config.clsCol}-11{overflow: hidden;vertical-align: middle;margin:0 auto;float:left;width:91.67%;}
			#${id} .${config.clsCol}-12{overflow: hidden;vertical-align: middle;margin:0 auto;float:left;width:100%;}
			#${id} .${config.clsShrink}{overflow: hidden;width:${sh}px;height:${sh}px;line-height: ${sh}px;vertical-align:middle;background: ${config.ui.color.basic};border: none;margin-left: 15px;padding-top:0px;}
			#${id} .${config.clsTitle}{overflow: hidden;height: ${height}px;line-height:${height}px;text-decoration: none;font-weight:600;padding-left:10px;}
			#${id} .${config.clsBody}{overflow: hidden;height: ${height}px;line-height:${height}px;text-decoration: none;font-size:12px;}
			#${id} .${config.clsNote}{overflow: hidden;height: ${height}px;line-height:${height}px;text-decoration: none;font-size:12px;}
			#${id} .${config.clsAdd}{margin:6px 30px 0px 0px;background: ${config.ui.color.basic};border: none;height:${sh}px;line-height: ${sh}px;}
			#${id} .${config.clsTime}{overflow: hidden;height: ${height}px;line-height:${height}px;text-decoration: none;padding:0px 0px 0px 0px;margin:0px 0px 0px -1px;height:${height}px;padding-left:0px;}
			#${id} .${config.clsTime} tr{margin:0 auto;padding:0px 0px 0px 0px;}
			#${id} .${config.clsTime} tbody{margin:0 auto;padding:0px 0px 0px 0px;height:${height}px;}
			#${id} .${config.clsTime} tr td{margin:0 auto;padding:0px 0px 0px 0px;}
			#${id} .${config.clsTime} input{text-align:center;padding-left:0px;margin:0px 0px 1px 0px;}
			#${id} .${config.clsTime} select{width:54px;font-size:14px;padding:0px 0px 1px 0px;text-align:center;height: 30px;line-height:${ih}px;border:1px solid #EEEEEE;}
			#${id} .${config.clsShort}{width:26px;}
			#${id} .${config.clsLong}{width:50px;}
			#${id} .${config.clsImgButton} {margin:0px 0px 0px 5px;width:24px;height:24px;overflow:hidden;display:inline;padding:0px 0px 0px 0px;}
			#${id} .${config.clsImgButton} img{width:24px;height:24px;opacity:0.2;margin:8px 0px 0px 0px;}
			#${id} .${config.clsImgButton} img:hover{opacity:0.5;}
			#${id} .${config.clsHide}{background:${config.ui.color.hide};}
			#${id} .${config.clsBool}{width:${ih*2+2}px;height:${ih+2}px;position:relative;margin:5px 0px 0px 0px;padding:0px 2px 0px 2px;border-radius:${ih*0.5}px;}
			#${id} .${config.clsBool}:before{ content:"";width:${ih}px;height:${ih+2}px;position:absolute;left:0;top:0;z-index:1;border-radius:${ih*0.5}px;}
			#${id} .${config.clsBool}:after{content:"";width:${ih}px;height:${ih+2}px;position:absolute;right:0;top:0;border-radius:14px;}
			#${id} .${config.clsBool} input[type=checkbox]{position:absolute;opacity: 0;}
			#${id} .${config.clsBool} input[type=checkbox]:checked+label:before{background:#3ccd58;}
			#${id} .${config.clsBool} label{width:${ih}px;height:${ih}px;position:relative;margin:1px 0px 0px 0px;}
			#${id} .${config.clsBool} label:before{content:"";width:${ih*2}px;height:${ih-2}px;position:absolute;background:#DDDDDD;border-radius:14px;margin:1px 0px 0px 0px;}
			#${id} .${config.clsBool} label:after{content:"";width:${ih}px;height:${ih-2}px;position:absolute;left:0;border-radius:14px;margin:1px 0px 0px 0px;background:#EEEEEE;z-index:2;transition:all 0.2s ease;}
			#${id} .${config.clsBool} input[type=checkbox]:checked+label:after{left:${ih}px;}
			</style>`;
        },
        hash: hash,
        removeSpace: function(str, cnt) { return str.replace(/\s+/g, cnt) },
        recoverSpace: function(str, cnt) { return str.replace(cnt, " ") },
    }
    window[appName] = self;
    //return self;
})(jQuery);